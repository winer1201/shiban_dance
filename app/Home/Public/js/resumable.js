/*
* MIT Licensed
* http://www.23developer.com/opensource
* http://github.com/23/resumable.js
* Steffen Tiedemann Christensen, steffen@23company.com
*/

(function(){
//"use strict";

  var Resumable = function(opts){
    if ( !(this instanceof Resumable) ) {
      return new Resumable(opts);
    }
    this.version = 1.0;
    // SUPPORTED BY BROWSER?
    // Check if these features are support by the browser:
    // - File object type
    // - Blob object type
    // - FileList object type
    // - slicing files
    this.support = (
                   (typeof(File)!=='undefined')
                   &&
                   (typeof(Blob)!=='undefined')
                   &&
                   (typeof(FileList)!=='undefined')
                   &&
                   (!!Blob.prototype.webkitSlice||!!Blob.prototype.mozSlice||!!Blob.prototype.slice||false)
                   );
    if(!this.support) return(false);


    // PROPERTIES
    var self = this;
    self.files = [];
    self.defaults = {
      chunkSize:1*1024*1024,
      forceChunkSize:false,
      simultaneousUploads:3,
      fileParameterName:'file',
      chunkNumberParameterName: 'resumableChunkNumber',
      chunkSizeParameterName: 'resumableChunkSize',
      currentChunkSizeParameterName: 'resumableCurrentChunkSize',
      totalSizeParameterName: 'resumableTotalSize',
      typeParameterName: 'resumableType',
      identifierParameterName: 'resumableIdentifier',
      fileNameParameterName: 'resumableFilename',
      relativePathParameterName: 'resumableRelativePath',
      totalChunksParameterName: 'resumableTotalChunks',
      throttleProgressCallbacks: 0.5,
      query:{},
      headers:{},
      preprocess:null,
      method:'multipart',
      uploadMethod: 'POST',
      testMethod: 'GET',
      prioritizeFirstAndLastChunk:false,
      target:'/',
      testTarget: null,
      parameterNamespace:'',
      testChunks:true,
      generateUniqueIdentifier:null,
      getTarget:null,
      maxChunkRetries:100,
      chunkRetryInterval:undefined,
      permanentErrors:[400, 404, 415, 500, 501],
      maxFiles:undefined,
      withCredentials:false,
      xhrTimeout:0,
      clearInput:true,
      maxFilesErrorCallback:function (files, errorCount) {
        var maxFiles = self.getOpt('maxFiles');
        alert('Please upload no more than ' + maxFiles + ' file' + (maxFiles === 1 ? '' : 's') + ' at a time.');
      },
      minFileSize:1,
      minFileSizeErrorCallback:function(file, errorCount) {
        alert(file.fileName||file.name +' is too small, please upload files larger than ' + selfh.formatSize(self.getOpt('minFileSize')) + '.');
      },
      maxFileSize:undefined,
      maxFileSizeErrorCallback:function(file, errorCount) {
        alert(file.fileName||file.name +' is too large, please upload files less than ' + selfh.formatSize(self.getOpt('maxFileSize')) + '.');
      },
      fileType: [],
      fileTypeErrorCallback: function(file, errorCount) {
        alert(file.fileName||file.name +' has type not allowed, please upload files of type ' + self.getOpt('fileType') + '.');
      }
    };
    self.opts = opts||{};
    self.getOpt = function(o) {
      var selfopt = this;
      // Get multiple option if passed an array
      if(o instanceof Array) {
        var options = {};
        selfh.each(o, function(option){
          options[option] = selfopt.getOpt(option);
        });
        return options;
      }
      // Otherwise, just return a simple option
      if (selfopt instanceof ResumableChunk) {
        if (typeof selfopt.opts[o] !== 'undefined') { return selfopt.opts[o]; }
        else { selfopt = selfopt.fileObj; }
      }
      if (selfopt instanceof ResumableFile) {
        if (typeof selfopt.opts[o] !== 'undefined') { return selfopt.opts[o]; }
        else { selfopt = selfopt.resumableObj; }
      }
      if (selfopt instanceof Resumable) {
        if (typeof selfopt.opts[o] !== 'undefined') { return selfopt.opts[o]; }
        else { return selfopt.defaults[o]; }
      }
    };

    // EVENTS
    // catchAll(event, ...)
    // fileSuccess(file), fileProgress(file), fileAdded(file, event), filesAdded(files, filesSkipped), fileRetry(file),
    // fileError(file, message), complete(), progress(), error(message, file), pause()
    self.events = [];
    self.on = function(event,callback){
      self.events.push(event.toLowerCase(), callback);
    };
    self.fire = function(){
      // `arguments` is an object, not array, in FF, so:
      var args = [];
      for (var i=0; i<arguments.length; i++) args.push(arguments[i]);
      // Find event listeners, and support pseudo-event `catchAll`
      var event = args[0].toLowerCase();
      for (var i=0; i<=self.events.length; i+=2) {
        if(self.events[i]==event) self.events[i+1].apply(self,args.slice(1));
        if(self.events[i]=='catchall') self.events[i+1].apply(null,args);
      }
      if(event=='fileerror') self.fire('error', args[2], args[1]);
      if(event=='fileprogress') self.fire('progress');
    };


    // INTERNAL HELPER METHODS (handy, but ultimately not part of uploading)
    var selfh = {
      stopEvent: function(e){
        e.stopPropagation();
        e.preventDefault();
      },
      each: function(o,callback){
        if(typeof(o.length)!=='undefined') {
          for (var i=0; i<o.length; i++) {
            // Array or FileList
            if(callback(o[i])===false) return;
          }
        } else {
          for (i in o) {
            // Object
            if(callback(i,o[i])===false) return;
          }
        }
      },
      generateUniqueIdentifier:function(file, event){
        var custom = self.getOpt('generateUniqueIdentifier');
        if(typeof custom === 'function') {
          return custom(file, event);
        }
        var relativePath = file.webkitRelativePath||file.fileName||file.name; // Some confusion in different versions of Firefox
        var size = file.size;
        return(size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, ''));
      },
      contains:function(array,test) {
        var result = false;

        selfh.each(array, function(value) {
          if (value == test) {
            result = true;
            return false;
          }
          return true;
        });

        return result;
      },
      formatSize:function(size){
        if(size<1024) {
          return size + ' bytes';
        } else if(size<1024*1024) {
          return (size/1024.0).toFixed(0) + ' KB';
        } else if(size<1024*1024*1024) {
          return (size/1024.0/1024.0).toFixed(1) + ' MB';
        } else {
          return (size/1024.0/1024.0/1024.0).toFixed(1) + ' GB';
        }
      },
      getTarget:function(request, params){
        var target = self.getOpt('target');

        if (request === 'test' && self.getOpt('testTarget')) {
          target = self.getOpt('testTarget') === '/' ? self.getOpt('target') : self.getOpt('testTarget');
        }

        if (typeof target === 'function') {
          return target(params);
        }

        var separator = target.indexOf('?') < 0 ? '?' : '&';
        var joinedParams = params.join('&');

        return target + separator + joinedParams;
      }
    };

    var onDrop = function(event){
      selfh.stopEvent(event);

      //handle dropped things as items if we can (this lets us deal with folders nicer in some cases)
      if (event.dataTransfer && event.dataTransfer.items) {
        loadFiles(event.dataTransfer.items, event);
      }
      //else handle them as files
      else if (event.dataTransfer && event.dataTransfer.files) {
        loadFiles(event.dataTransfer.files, event);
      }
    };
    var preventDefault = function(e) {
      e.preventDefault();
    };

    /**
     * processes a single upload item (file or directory)
     * @param {Object} item item to upload, may be file or directory entry
     * @param {string} path current file path
     * @param {File[]} items list of files to append new items to
     * @param {Function} cb callback invoked when item is processed
     */
    function processItem(item, path, items, cb) {
      var entry;
      if(item.isFile){
        // file provided
        return item.file(function(file){
          file.relativePath = path + file.name;
          items.push(file);
          cb();
        });
      }else if(item.isDirectory){
        // item is already a directory entry, just assign
        entry = item;
      }else if(item instanceof File) {
        items.push(item);
      }
      if('function' === typeof item.webkitGetAsEntry){
        // get entry from file object
        entry = item.webkitGetAsEntry();
      }
      if(entry && entry.isDirectory){
        // directory provided, process it
        return processDirectory(entry, path + entry.name + '/', items, cb);
      }
      if('function' === typeof item.getAsFile){
        // item represents a File object, convert it
        item = item.getAsFile();
        item.relativePath = path + item.name;
        items.push(item);
      }
      cb(); // indicate processing is done
    }


    /**
     * cps-style list iteration.
     * invokes all functions in list and waits for their callback to be
     * triggered.
     * @param  {Function[]}   items list of functions expecting callback parameter
     * @param  {Function} cb    callback to trigger after the last callback has been invoked
     */
    function processCallbacks(items, cb){
      if(!items || items.length === 0){
        // empty or no list, invoke callback
        return cb();
      }
      // invoke current function, pass the next part as continuation
      items[0](function(){
        processCallbacks(items.slice(1), cb);
      });
    }

    /**
     * recursively traverse directory and collect files to upload
     * @param  {Object}   directory directory to process
     * @param  {string}   path      current path
     * @param  {File[]}   items     target list of items
     * @param  {Function} cb        callback invoked after traversing directory
     */
    function processDirectory (directory, path, items, cb) {
      var dirReader = directory.createReader();
      dirReader.readEntries(function(entries){
        if(!entries.length){
          // empty directory, skip
          return cb();
        }
        // process all conversion callbacks, finally invoke own one
        processCallbacks(
          entries.map(function(entry){
            // bind all properties except for callback
            return processItem.bind(null, entry, path, items);
          }),
          cb
        );
      });
    }

    /**
     * process items to extract files to be uploaded
     * @param  {File[]} items items to process
     * @param  {Event} event event that led to upload
     */
    function loadFiles(items, event) {
      if(!items.length){
        return; // nothing to do
      }
      self.fire('beforeAdd');
      var files = [];
      processCallbacks(
          Array.prototype.map.call(items, function(item){
            // bind all properties except for callback
            return processItem.bind(null, item, "", files);
          }),
          function(){
            if(files.length){
              // at least one file found
              appendFilesFromFileList(files, event);
            }
          }
      );
    };

    var appendFilesFromFileList = function(fileList, event){
      // check for uploading too many files
      var errorCount = 0;
      var o = self.getOpt(['maxFiles', 'minFileSize', 'maxFileSize', 'maxFilesErrorCallback', 'minFileSizeErrorCallback', 'maxFileSizeErrorCallback', 'fileType', 'fileTypeErrorCallback']);
      if (typeof(o.maxFiles)!=='undefined' && o.maxFiles<(fileList.length+self.files.length)) {
        // if single-file upload, file is already added, and trying to add 1 new file, simply replace the already-added file
        if (o.maxFiles===1 && self.files.length===1 && fileList.length===1) {
          self.removeFile(self.files[0]);
        } else {
          o.maxFilesErrorCallback(fileList, errorCount++);
          return false;
        }
      }
      var files = [], filesSkipped = [], remaining = fileList.length;
      var decreaseReamining = function(){
        if(!--remaining){
          // all files processed, trigger event
          if(!files.length && !filesSkipped.length){
            // no succeeded files, just skip
            return;
          }
          window.setTimeout(function(){
            self.fire('filesAdded', files, filesSkipped);
          },0);
        }
      };
      selfh.each(fileList, function(file){
        var fileName = file.name;
        if(o.fileType.length > 0){
          var fileTypeFound = false;
          for(var index in o.fileType){
            var extension = '.' + o.fileType[index];
            if(fileName.indexOf(extension, fileName.length - extension.length) !== -1){
              fileTypeFound = true;
              break;
            }
          }
          if (!fileTypeFound) {
            o.fileTypeErrorCallback(file, errorCount++);
            return false;
          }
        }

        if (typeof(o.minFileSize)!=='undefined' && file.size<o.minFileSize) {
          o.minFileSizeErrorCallback(file, errorCount++);
          return false;
        }
        if (typeof(o.maxFileSize)!=='undefined' && file.size>o.maxFileSize) {
          o.maxFileSizeErrorCallback(file, errorCount++);
          return false;
        }

        function addFile(uniqueIdentifier){
          if (!self.getFromUniqueIdentifier(uniqueIdentifier)) {(function(){
            file.uniqueIdentifier = uniqueIdentifier;
            var f = new ResumableFile(self, file, uniqueIdentifier);
            self.files.push(f);
            files.push(f);
            f.container = (typeof event != 'undefined' ? event.srcElement : null);
            window.setTimeout(function(){
              self.fire('fileAdded', f, event)
            },0);
          })()} else {
            filesSkipped.push(file);
          };
          decreaseReamining();
        }
        // directories have size == 0
        var uniqueIdentifier = selfh.generateUniqueIdentifier(file, event);
        if(uniqueIdentifier && typeof uniqueIdentifier.then === 'function'){
          // Promise or Promise-like object provided as unique identifier
          uniqueIdentifier
          .then(
            function(uniqueIdentifier){
              // unique identifier generation succeeded
              addFile(uniqueIdentifier);
            },
           function(){
              // unique identifier generation failed
              // skip further processing, only decrease file count
              decreaseReamining();
            }
          );
        }else{
          // non-Promise provided as unique identifier, process synchronously
          addFile(uniqueIdentifier);
        }
      });
    };

    // INTERNAL OBJECT TYPES
    function ResumableFile(resumableObj, file, uniqueIdentifier){
      var self = this;
      self.opts = {};
      self.getOpt = resumableObj.getOpt;
      self._prevProgress = 0;
      self.resumableObj = resumableObj;
      self.file = file;
      self.fileName = file.fileName||file.name; // Some confusion in different versions of Firefox
      self.size = file.size;
      self.relativePath = file.relativePath || file.webkitRelativePath || self.fileName;
      self.uniqueIdentifier = uniqueIdentifier;
      self._pause = false;
      self.container = '';
      var _error = uniqueIdentifier !== undefined;

      // Callback when something happens within the chunk
      var chunkEvent = function(event, message){
        // event can be 'progress', 'success', 'error' or 'retry'
        switch(event){
        case 'progress':
          self.resumableObj.fire('fileProgress', self);
          break;
        case 'error':
          self.abort();
          _error = true;
          self.chunks = [];
          self.resumableObj.fire('fileError', self, message);
          break;
        case 'success':
          if(_error) return;
          self.resumableObj.fire('fileProgress', self); // it's at least progress
          if(self.isComplete()) {
            self.resumableObj.fire('fileSuccess', self, message);
          }
          break;
        case 'retry':
          self.resumableObj.fire('fileRetry', self);
          break;
        }
      };

      // Main code to set up a file object with chunks,
      // packaged to be able to handle retries if needed.
      self.chunks = [];
      self.abort = function(){
        // Stop current uploads
        var abortCount = 0;
        selfh.each(self.chunks, function(c){
          if(c.status()=='uploading') {
            c.abort();
            abortCount++;
          }
        });
        if(abortCount>0) self.resumableObj.fire('fileProgress', self);
      };
      self.cancel = function(){
        // Reset this file to be void
        var _chunks = self.chunks;
        self.chunks = [];
        // Stop current uploads
        selfh.each(_chunks, function(c){
          if(c.status()=='uploading')  {
            c.abort();
            self.resumableObj.uploadNextChunk();
          }
        });
        self.resumableObj.removeFile(self);
        self.resumableObj.fire('fileProgress', self);
      };
      self.retry = function(){
        self.bootstrap();
        var firedRetry = false;
        self.resumableObj.on('chunkingComplete', function(){
          if(!firedRetry) self.resumableObj.upload();
          firedRetry = true;
        });
      };
      self.bootstrap = function(){
        self.abort();
        _error = false;
        // Rebuild stack of chunks from file
        self.chunks = [];
        self._prevProgress = 0;
        var round = self.getOpt('forceChunkSize') ? Math.ceil : Math.floor;
        var maxOffset = Math.max(round(self.file.size/self.getOpt('chunkSize')),1);
        for (var offset=0; offset<maxOffset; offset++) {(function(offset){
            window.setTimeout(function(){
                self.chunks.push(new ResumableChunk(self.resumableObj, self, offset, chunkEvent));
                self.resumableObj.fire('chunkingProgress',self,offset/maxOffset);
            },0);
        })(offset)}
        window.setTimeout(function(){
            self.resumableObj.fire('chunkingComplete',self);
        },0);
      };
      self.progress = function(){
        if(_error) return(1);
        // Sum up progress across everything
        var ret = 0;
        var error = false;
        selfh.each(self.chunks, function(c){
          if(c.status()=='error') error = true;
          ret += c.progress(true); // get chunk progress relative to entire file
        });
        ret = (error ? 1 : (ret>0.99999 ? 1 : ret));
        ret = Math.max(self._prevProgress, ret); // We don't want to lose percentages when an upload is paused
        self._prevProgress = ret;
        return(ret);
      };
      self.isUploading = function(){
        var uploading = false;
        selfh.each(self.chunks, function(chunk){
          if(chunk.status()=='uploading') {
            uploading = true;
            return(false);
          }
        });
        return(uploading);
      };
      self.isComplete = function(){
        var outstanding = false;
        selfh.each(self.chunks, function(chunk){
          var status = chunk.status();
          if(status=='pending' || status=='uploading' || chunk.preprocessState === 1) {
            outstanding = true;
            return(false);
          }
        });
        return(!outstanding);
      };
      self.pause = function(pause){
          if(typeof(pause)==='undefined'){
              self._pause = (self._pause ? false : true);
          }else{
              self._pause = pause;
          }
      };
      self.isPaused = function() {
        return self._pause;
      };


      // Bootstrap and return
      self.resumableObj.fire('chunkingStart', self);
      self.bootstrap();
      return(this);
    }


    function ResumableChunk(resumableObj, fileObj, offset, callback){
      var self = this;
      self.opts = {};
      self.getOpt = resumableObj.getOpt;
      self.resumableObj = resumableObj;
      self.fileObj = fileObj;
      self.fileObjSize = fileObj.size;
      self.fileObjType = fileObj.file.type;
      self.offset = offset;
      self.callback = callback;
      self.lastProgressCallback = (new Date);
      self.tested = false;
      self.retries = 0;
      self.pendingRetry = false;
      self.preprocessState = 0; // 0 = unprocessed, 1 = processing, 2 = finished

      // Computed properties
      var chunkSize = self.getOpt('chunkSize');
      self.loaded = 0;
      self.startByte = self.offset*chunkSize;
      self.endByte = Math.min(self.fileObjSize, (self.offset+1)*chunkSize);
      if (self.fileObjSize-self.endByte < chunkSize && !self.getOpt('forceChunkSize')) {
        // The last chunk will be bigger than the chunk size, but less than 2*chunkSize
        self.endByte = self.fileObjSize;
      }
      self.xhr = null;

      // test() makes a GET request without any data to see if the chunk has already been uploaded in a previous session
      self.test = function(){
        // Set up request and listen for event
        self.xhr = new XMLHttpRequest();

        var testHandler = function(e){
          self.tested = true;
          var status = self.status();
          if(status=='success') {
            self.callback(status, self.message());
            self.resumableObj.uploadNextChunk();
          } else {
            self.send();
          }
        };
        self.xhr.addEventListener('load', testHandler, false);
        self.xhr.addEventListener('error', testHandler, false);
        self.xhr.addEventListener('timeout', testHandler, false);

        // Add data from the query options
        var params = [];
        var parameterNamespace = self.getOpt('parameterNamespace');
        var customQuery = self.getOpt('query');
        if(typeof customQuery == 'function') customQuery = customQuery(self.fileObj, self);
        selfh.each(customQuery, function(k,v){
          params.push([encodeURIComponent(parameterNamespace+k), encodeURIComponent(v)].join('='));
        });
        // Add extra data to identify chunk
        params = params.concat(
          [
            // define key/value pairs for additional parameters
            ['chunkNumberParameterName', self.offset + 1],
            ['chunkSizeParameterName', self.getOpt('chunkSize')],
            ['currentChunkSizeParameterName', self.endByte - self.startByte],
            ['totalSizeParameterName', self.fileObjSize],
            ['typeParameterName', self.fileObjType],
            ['identifierParameterName', self.fileObj.uniqueIdentifier],
            ['fileNameParameterName', self.fileObj.fileName],
            ['relativePathParameterName', self.fileObj.relativePath],
            ['totalChunksParameterName', self.fileObj.chunks.length]
          ].filter(function(pair){
            // include items that resolve to truthy values
            // i.e. exclude false, null, undefined and empty strings
            return self.getOpt(pair[0]);
          })
          .map(function(pair){
            // map each key/value pair to its final form
            return [
              parameterNamespace + self.getOpt(pair[0]),
              encodeURIComponent(pair[1])
            ].join('=');
          })
        );
        // Append the relevant chunk and send it
        self.xhr.open(self.getOpt('testMethod'), selfh.getTarget('test', params));
        self.xhr.timeout = self.getOpt('xhrTimeout');
        self.xhr.withCredentials = self.getOpt('withCredentials');
        // Add data from header options
        var customHeaders = self.getOpt('headers');
        if(typeof customHeaders === 'function') {
          customHeaders = customHeaders(self.fileObj, self);
        }
        selfh.each(customHeaders, function(k,v) {
          self.xhr.setRequestHeader(k, v);
        });
        self.xhr.send(null);
      };

      self.preprocessFinished = function(){
        self.preprocessState = 2;
        self.send();
      };

      // send() uploads the actual data in a POST call
      self.send = function(){
        var preprocess = self.getOpt('preprocess');
        if(typeof preprocess === 'function') {
          switch(self.preprocessState) {
          case 0: self.preprocessState = 1; preprocess(self); return;
          case 1: return;
          case 2: break;
          }
        }
        if(self.getOpt('testChunks') && !self.tested) {
          self.test();
          return;
        }

        // Set up request and listen for event
        self.xhr = new XMLHttpRequest();

        // Progress
        self.xhr.upload.addEventListener('progress', function(e){
          if( (new Date) - self.lastProgressCallback > self.getOpt('throttleProgressCallbacks') * 1000 ) {
            self.callback('progress');
            self.lastProgressCallback = (new Date);
          }
          self.loaded=e.loaded||0;
        }, false);
        self.loaded = 0;
        self.pendingRetry = false;
        self.callback('progress');

        // Done (either done, failed or retry)
        var doneHandler = function(e){
          var status = self.status();
          if(status=='success'||status=='error') {
            self.callback(status, self.message());
            self.resumableObj.uploadNextChunk();
          } else {
            self.callback('retry', self.message());
            self.abort();
            self.retries++;
            var retryInterval = self.getOpt('chunkRetryInterval');
            if(retryInterval !== undefined) {
              self.pendingRetry = true;
              setTimeout(self.send, retryInterval);
            } else {
              self.send();
            }
          }
        };
        self.xhr.addEventListener('load', doneHandler, false);
        self.xhr.addEventListener('error', doneHandler, false);
        self.xhr.addEventListener('timeout', doneHandler, false);

        // Set up the basic query data from Resumable
        var query = [
          ['chunkNumberParameterName', self.offset + 1],
          ['chunkSizeParameterName', self.getOpt('chunkSize')],
          ['currentChunkSizeParameterName', self.endByte - self.startByte],
          ['totalSizeParameterName', self.fileObjSize],
          ['typeParameterName', self.fileObjType],
          ['identifierParameterName', self.fileObj.uniqueIdentifier],
          ['fileNameParameterName', self.fileObj.fileName],
          ['relativePathParameterName', self.fileObj.relativePath],
          ['totalChunksParameterName', self.fileObj.chunks.length],
        ].filter(function(pair){
          // include items that resolve to truthy values
          // i.e. exclude false, null, undefined and empty strings
          return self.getOpt(pair[0]);
        })
        .reduce(function(query, pair){
          // assign query key/value
          query[self.getOpt(pair[0])] = pair[1];
          return query;
        }, {});
        // Mix in custom data
        var customQuery = self.getOpt('query');
        if(typeof customQuery == 'function') customQuery = customQuery(self.fileObj, self);
        selfh.each(customQuery, function(k,v){
          query[k] = v;
        });

        var func = (self.fileObj.file.slice ? 'slice' : (self.fileObj.file.mozSlice ? 'mozSlice' : (self.fileObj.file.webkitSlice ? 'webkitSlice' : 'slice')));
        var bytes = self.fileObj.file[func](self.startByte, self.endByte);
        var data = null;
        var params = [];

        var parameterNamespace = self.getOpt('parameterNamespace');
        if (self.getOpt('method') === 'octet') {
          // Add data from the query options
          data = bytes;
          selfh.each(query, function (k, v) {
            params.push([encodeURIComponent(parameterNamespace + k), encodeURIComponent(v)].join('='));
          });
        } else {
          // Add data from the query options
          data = new FormData();
          selfh.each(query, function (k, v) {
            data.append(parameterNamespace + k, v);
            params.push([encodeURIComponent(parameterNamespace + k), encodeURIComponent(v)].join('='));
          });
          data.append(parameterNamespace + self.getOpt('fileParameterName'), bytes);
        }

        var target = selfh.getTarget('upload', params);
        var method = self.getOpt('uploadMethod');

        self.xhr.open(method, target);
        if (self.getOpt('method') === 'octet') {
          self.xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        }
        self.xhr.timeout = self.getOpt('xhrTimeout');
        self.xhr.withCredentials = self.getOpt('withCredentials');
        // Add data from header options
        var customHeaders = self.getOpt('headers');
        if(typeof customHeaders === 'function') {
          customHeaders = customHeaders(self.fileObj, self);
        }

        selfh.each(customHeaders, function(k,v) {
          self.xhr.setRequestHeader(k, v);
        });

        self.xhr.send(data);
      };
      self.abort = function(){
        // Abort and reset
        if(self.xhr) self.xhr.abort();
        self.xhr = null;
      };
      self.status = function(){
        // Returns: 'pending', 'uploading', 'success', 'error'
        if(self.pendingRetry) {
          // if pending retry then that's effectively the same as actively uploading,
          // there might just be a slight delay before the retry starts
          return('uploading');
        } else if(!self.xhr) {
          return('pending');
        } else if(self.xhr.readyState<4) {
          // Status is really 'OPENED', 'HEADERS_RECEIVED' or 'LOADING' - meaning that stuff is happening
          return('uploading');
        } else {
          if(self.xhr.status == 200 || self.xhr.status == 201) {
            // HTTP 200, 201 (created)
            return('success');
          } else if(selfh.contains(self.getOpt('permanentErrors'), self.xhr.status) || self.retries >= self.getOpt('maxChunkRetries')) {
            // HTTP 415/500/501, permanent error
            return('error');
          } else {
            // this should never happen, but we'll reset and queue a retry
            // a likely case for this would be 503 service unavailable
            self.abort();
            return('pending');
          }
        }
      };
      self.message = function(){
        return(self.xhr ? self.xhr.responseText : '');
      };
      self.progress = function(relative){
        if(typeof(relative)==='undefined') relative = false;
        var factor = (relative ? (self.endByte-self.startByte)/self.fileObjSize : 1);
        if(self.pendingRetry) return(0);
        if(!self.xhr || !self.xhr.status) factor*=.95;
        var s = self.status();
        switch(s){
        case 'success':
        case 'error':
          return(1*factor);
        case 'pending':
          return(0*factor);
        default:
          return(self.loaded/(self.endByte-self.startByte)*factor);
        }
      };
      return(this);
    }

    // QUEUE
    self.uploadNextChunk = function(){
      var found = false;

      // In some cases (such as videos) it's really handy to upload the first
      // and last chunk of a file quickly; this let's the server check the file's
      // metadata and determine if there's even a point in continuing.
      if (self.getOpt('prioritizeFirstAndLastChunk')) {
        selfh.each(self.files, function(file){
          if(file.chunks.length && file.chunks[0].status()=='pending' && file.chunks[0].preprocessState === 0) {
            file.chunks[0].send();
            found = true;
            return(false);
          }
          if(file.chunks.length>1 && file.chunks[file.chunks.length-1].status()=='pending' && file.chunks[file.chunks.length-1].preprocessState === 0) {
            file.chunks[file.chunks.length-1].send();
            found = true;
            return(false);
          }
        });
        if(found) return(true);
      }

      // Now, simply look for the next, best thing to upload
      selfh.each(self.files, function(file){
        if(file.isPaused()===false){
         selfh.each(file.chunks, function(chunk){
           if(chunk.status()=='pending' && chunk.preprocessState === 0) {
             chunk.send();
             found = true;
             return(false);
           }
          });
        }
        if(found) return(false);
      });
      if(found) return(true);

      // The are no more outstanding chunks to upload, check is everything is done
      var outstanding = false;
      selfh.each(self.files, function(file){
        if(!file.isComplete()) {
          outstanding = true;
          return(false);
        }
      });
      if(!outstanding) {
        // All chunks have been uploaded, complete
        self.fire('complete');
      }
      return(false);
    };


    // PUBLIC METHODS FOR RESUMABLE.JS
    self.assignBrowse = function(domNodes, isDirectory){
      if(typeof(domNodes.length)=='undefined') domNodes = [domNodes];

      selfh.each(domNodes, function(domNode) {
        var input;
        if(domNode.tagName==='INPUT' && domNode.type==='file'){
          input = domNode;
        } else {
          input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.style.display = 'none';
          domNode.addEventListener('click', function(){
            input.style.opacity = 0;
            input.style.display='block';
            input.focus();
            input.click();
            input.style.display='none';
          }, false);
          domNode.appendChild(input);
        }
        var maxFiles = self.getOpt('maxFiles');
        if (typeof(maxFiles)==='undefined'||maxFiles!=1){
          input.setAttribute('multiple', 'multiple');
        } else {
          input.removeAttribute('multiple');
        }
        if(isDirectory){
          input.setAttribute('webkitdirectory', 'webkitdirectory');
        } else {
          input.removeAttribute('webkitdirectory');
        }
        // When new files are added, simply append them to the overall list
        input.addEventListener('change', function(e){
          appendFilesFromFileList(e.target.files,e);
          var clearInput = self.getOpt('clearInput');
          if (clearInput) {
            e.target.value = '';
          }
        }, false);
      });
    };
    self.assignDrop = function(domNodes){
      if(typeof(domNodes.length)=='undefined') domNodes = [domNodes];

      selfh.each(domNodes, function(domNode) {
        domNode.addEventListener('dragover', preventDefault, false);
        domNode.addEventListener('dragenter', preventDefault, false);
        domNode.addEventListener('drop', onDrop, false);
      });
    };
    self.unAssignDrop = function(domNodes) {
      if (typeof(domNodes.length) == 'undefined') domNodes = [domNodes];

      selfh.each(domNodes, function(domNode) {
        domNode.removeEventListener('dragover', preventDefault);
        domNode.removeEventListener('dragenter', preventDefault);
        domNode.removeEventListener('drop', onDrop);
      });
    };
    self.isUploading = function(){
      var uploading = false;
      selfh.each(self.files, function(file){
        if (file.isUploading()) {
          uploading = true;
          return(false);
        }
      });
      return(uploading);
    };
    self.upload = function(){
      // Make sure we don't start too many uploads at once
      if(self.isUploading()) return;
      // Kick off the queue
      self.fire('uploadStart');
      for (var num=1; num<=self.getOpt('simultaneousUploads'); num++) {
        self.uploadNextChunk();
      }
    };
    self.pause = function(){
      // Resume all chunks currently being uploaded
      selfh.each(self.files, function(file){
        file.abort();
      });
      self.fire('pause');
    };
    self.cancel = function(){
      self.fire('beforeCancel');
      for(var i = self.files.length - 1; i >= 0; i--) {
        self.files[i].cancel();
      }
      self.fire('cancel');
    };
    self.progress = function(){
      var totalDone = 0;
      var totalSize = 0;
      // Resume all chunks currently being uploaded
      selfh.each(self.files, function(file){
        totalDone += file.progress()*file.size;
        totalSize += file.size;
      });
      return(totalSize>0 ? totalDone/totalSize : 0);
    };
    self.addFile = function(file, event){
      appendFilesFromFileList([file], event);
    };
    self.removeFile = function(file){
      for(var i = self.files.length - 1; i >= 0; i--) {
        if(self.files[i] === file) {
          self.files.splice(i, 1);
        }
      }
    };
    self.getFromUniqueIdentifier = function(uniqueIdentifier){
      var ret = false;
      selfh.each(self.files, function(f){
        if(f.uniqueIdentifier==uniqueIdentifier) ret = f;
      });
      return(ret);
    };
    self.getSize = function(){
      var totalSize = 0;
      selfh.each(self.files, function(file){
        totalSize += file.size;
      });
      return(totalSize);
    };
    self.handleDropEvent = function (e) {
      onDrop(e);
    };
    self.handleChangeEvent = function (e) {
      appendFilesFromFileList(e.target.files, e);
      e.target.value = '';
    };
    self.updateQuery = function(query){
        self.opts.query = query;
    };

    return(this);
  };


  // Node.js-style export for Node and Component
  if (typeof module != 'undefined') {
    module.exports = Resumable;
  } else if (typeof define === "function" && define.amd) {
    // AMD/requirejs: Define the module
    define(function(){
      return Resumable;
    });
  } else {
    // Browser: Expose to window
    window.Resumable = Resumable;
  }

})();

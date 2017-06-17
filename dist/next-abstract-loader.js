(function () {

  var global = global || window || this;
  var Q = global.Q || require('q');

  var nx = global.nx || require('next-js-core2');
  var DEFAULTS = {
    timeout: 2000
  };
  
  var NxAbstractLoader = nx.declare('nx.AbstractLoader', {
    methods:{
      init: function(inOptions){
        this.xhr = new XMLHttpRequest();
        this.options = nx.mix( DEFAULTS, inOptions);
      },
      load: function(inUrl){
        var xhr = this.xhr;
        var defer=Q.defer();
        xhr.open( 'GET', inUrl );
        xhr.onreadystatechange = function() {
          if ( xhr.readyState === 4 ) {
            if ( xhr.status === 200  || (  xhr.status === 0  && xhr.responseText )) {
              defer.resolve({
                xhr: xhr,
                content: xhr.responseText,
                type: xhr.getResponseHeader('content-type')
              });
            } else {
              defer.reject({
                xhr: xhr,
                content: xhr.statusText
              });
            }
          }
        };
        this.attachEvents();
        xhr.send(null);
        return defer.promise;
      },
      attachEvents: function(){
        // By default XHRs never timeout, and even Chrome doesn't implement the
        // spec for xhr.timeout. So we do it ourselves.
        var xhr = this.xhr;
        setTimeout( function () {
          if( xhr.readyState < 4 ) {
            xhr.abort();
          }
        }, this.options.timeout );
      }
    }
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxAbstractLoader;
  }

}());

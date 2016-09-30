


// step 1.2
var store = Redux.createStore(combineReducer, Redux.applyMiddleware(logger, crashReporter, thunk));
// ~end step 1.2
// step 1.3

function render() {
    var state = store.getState();
    document.getElementById('value').innerHTML = state.count.result;
    document.getElementById('value2').innerHTML = state.sum;

    if (state.count.loading) {
      document.getElementById('status').innerHTML = 'is loading...';
    }
    else {
      document.getElementById('status').innerHTML = 'loaded';
    }

    if (state.images.loading === 'undefined') {
      document.getElementById('imageStatus').innerHTML = "Please click the 'Random Images' button";
    }
    else if (state.images.loading) {
      document.getElementById('imageStatus').innerHTML = 'is loading...';
    }
    else {
      document.getElementById('imageStatus').innerHTML = 'loaded';
    }

    var imgs;
    state.images.images.forEach(i => imgs += '<img src="' + i + '"></img>')
    document.getElementById('imagesList').innerHTML = imgs;

};

store.subscribe(render);
// ~end step 1.3
render();

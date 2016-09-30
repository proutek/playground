
function images(currentState, action){
    var DEFAULT_STATE = {loading:undefined, images:[]};
    var nextState = Object.assign({}, currentState);

    if (currentState === undefined) { // look at to Note 1.1
        nextState = DEFAULT_STATE;// Note1.2
        return nextState;
    }
    switch (action.type) {

      case 'RANDOM_IMAGES': // look at Note2.1
        nextState.images = action.images;
        nextState.loading = false;
        return nextState;// Note2.2

      case 'RANDOM_IMAGES_LOADING':
        nextState.loading = true;
        return nextState;

      default:
        nextState = currentState;
        return nextState;
    }
}

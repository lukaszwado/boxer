/**
 *
 * @author Lukasz Wadowski
 *
 * @licence Copyright 2016 by Lukasz Wadowski and contributors, MIT License
 *
 */

'use strict';

/**
 *
 * TODO - should all of the data be immutable when accessing them and object is set to be immutable?
 * TODO - think if accessing Boxers by ID has sens when you can pass direct reference instead
 * TODO - think if name is necessary - maybe it's better to have ID only
 * TODO - add property to "set multiple"
 * TODO - improve error logging
 * TODO - build proof of design with angular 2
 * TODO - create proper build process with Gulp or Grunt
 * TODO - publish with npm
 *
 */


/**
 *
 * Boxer constructor
 * this._$$dataContainer - contains data
 * this._$$eventListeners - contains events
 * this._$$immutable - switch between mutable or immutable modes
 * this._$$protected - if object is protected against baypassing $set method bye use of yourState.method before it was initialised
 *
 * @param protect
 * @param immutable
 * @constructor
 */

var Boxer = function Boxer( name, registered, immutable, protect ) {

  this._$$name = name || ''; // Makes debugging a bit easier

  if ( registered ) { // register boxer in global scope
    this._$$register( this );
  }

  /* Data container */
  this._$$dataContainer = new Map();

  /* Event Listeners */
  this._$$eventListeners = {
    /* Global event listeners */
    '__*__': []
  };
  /* Is immutable */
  this._$$immutable = this._$$booleanOrTrue( immutable );//typeof immutable !== 'boolean' ? true : immutable;

  this._$$frozen = false; //if object is frozen you cannot assign new values to its properties

  /* Set proxy trap to prevent setting uninitialized properties - ES6 ONLY */
  var protectSetting = this._$$booleanOrTrue( protect ) //protect !== 'boolean' ? true : protect
    , proxySupport = this._$$isProxySupported()
    ;

  this._$$protected = proxySupport && protectSetting;

  if ( this._$$protected ) {
    return this._$$protect( this );
  }
};

/**
 * Stores all boxers that can be accessed globally
 * @type {{nextFreeId: number, boxers: {}}}
 * @private
 */
Boxer.prototype._$$boxerStore = {
  nextFreeId: 0,
  boxers: {}
};

/**
 * Get boxer which was registered globally
 * @param boxer
 * @returns Boxer || null
 * @private
 */
Boxer.prototype.$getBoxerById = function $getBoxerById( id ) {
  return this._$$boxerStore.boxers[ id ] || null;
};

/**
 * Register boxer in global scope
 * @param boxer
 * @returns Boxer
 * @private
 */
Boxer.prototype._$$register = function _$$register( boxer ) {

  var isRegistered = typeof this._$$registeredId === 'number';

  if ( !isRegistered ) {
    this._$$boxerStore.boxers[ this._$$boxerStore.nextFreeId ] = boxer;
    this._$$registeredId = this._$$boxerStore.nextFreeId;
    this._$$boxerStore.nextFreeId++;
  } else {
    console.error( 'Boxer already registered with id: ' + this._$$registeredId, {
      boxer: this
    } );
    console.trace();
  }
  return this;
};

/**
 *
 * Returns object name
 *
 * @param boolean
 * @private
 */
Boxer.prototype.$getName = function $getName() {
  return this._$$name;
};

/**
 * Register boxer in global scope
 * @param boxer
 * @returns Boxer
 */
Boxer.prototype.$register = function $register() {
  this.register( this );
  return this;
};

/**
 * Returns registered ID if boxer was registered or null if it wasn't
 * @param boxer
 * @returns {number||null}
 */
Boxer.prototype.$getId = function $getId() {
  return this._$$registeredId || null;
};

/**
 *
 * Set objects name if it wasn't set before
 *
 * @param boolean
 * @private
 */
Boxer.prototype.$setName = function $setName( name, register ) {
  if ( this._$$name === '' ) {
    this._$$name = name;
    if ( register ) {
      this._$$register( this );
    }
  } else {
    console.log( 'Boxer cannot be renamed', {
      boxer: this
    } );
  }
  return this;
};

/**
 *
 * function returns parameter if it is type boolean, if not it returns true
 *
 * @param boolean
 * @private
 */
Boxer.prototype._$$booleanOrTrue = function _$$booleanOrTrue( boolean ) {
  return typeof boolean !== 'boolean' ? true : boolean;
};

/**
 * Freeze the object
 */
Boxer.prototype.$freeze = function $freeze() {
  this._$$frozen = true;
  return this;
};

/**
 * Unfreeze the object
 * @private
 */
Boxer.prototype.$unfreeze = function $unfreeze() {
  this._$$frozen = false;
  return this;
};

/**
 * Check if object is frozen
 * @returns {boolean}
 * @private
 */
Boxer.prototype.$isFrozen = function $isFrozen() {
  return this._$$frozen;
};

/**
 *
 * Test browsers support for ES6 Proxy
 *
 * @returns {boolean}
 * @private
 */
Boxer.prototype._$$isProxySupported = function _$$isProxySupported() {
  return typeof Proxy !== 'undefined';
};

Boxer.prototype._wasPropertyInitialized = function _wasPropertyInitialized( key ) {
  return !!Object.getOwnPropertyDescriptor( this, key );
};

/**
 *
 * Set proxy trap to prevent setting uninitialized properties - ES6 ONLY
 *
 * @param boxerObj
 * @returns {Proxy}
 * @private
 */
Boxer.prototype._$$protect = function _$$protect( boxerObj ) {
  return new Proxy( boxerObj, {
    set: function ( _that, key, val ) {
      var isPermitted = key.indexOf( '_$$' ) === 0 //only private variable can be changed without prior definition
        , wasPropertyInitialised = _that._wasPropertyInitialized( key )
        ;

      /* TODO - improve setter performance */
      /* Allow to set permitted values only */
      if ( isPermitted ) {
        _that[ key ] = val;
      } else if ( wasPropertyInitialised && !_that._$$frozen ) {
        _that.$set( key, val );
      } else if ( wasPropertyInitialised && _that._$$frozen ) {
        console.error( 'Boxer is frozen - to assign value to Boxer please unfreeze it first.', {
          boxer: _that
        } );
        console.trace();
      } else {
        console.trace();
        throw 'Cannot assign value (' + val + ') to property (' + key + ') which wasn\'t initialised, use $set or $initProperty methods to create new value';
      }

      return true;

    }
  } );
}

/**
 *
 * Returns true if object is protected against baypassing $set when setting new properties
 *
 * @returns {boolean|*}
 */

Boxer.prototype.$isProtected = function _$$isProtected() {
  return this._$$protected;
};

/**
 *
 * Returns true if object is mutable
 *
 * @returns {boolean}
 */

Boxer.prototype.$isMutable = function _$$isMutable() {
  return !this._$$immutable;
};

/**
 *
 * get method - to access data you can access yourState.property as well after property was initialised
 *
 * @param prop
 * @returns {Map} or property value if set
 */

Boxer.prototype.$get = function $get( prop ) {
  return typeof prop === 'undefined'
    ? this._$$dataContainer
    : this._$$dataContainer.get( prop );
};

/**
 *
 * set method - once method was initialised you can use yourState.yourProperty = 1 to assign values
 *
 * @param key
 * @param val
 * @returns {Boxer}
 */

Boxer.prototype.$set = function $set( key, val ) {

  if ( key === '__*__' ) {
    console.error( '__*__ is not allowed as a key because it is used as a wildcard event identifier' );
    console.trace();
  } else if ( !this._$$frozen ) {

    var oldValue = this.$get( key );

    var valueChanged = oldValue !== val;

    /* IF object is immutable then set new data container */
    if ( this._$$immutable ) {
      this._$$dataContainer = new Map( this._$$dataContainer );
    }

    this._$$dataContainer.set( key, val );

    this.$initProperty( key );

    this._$$fireEventListeners( key, val, oldValue, valueChanged );
  } else {
    console.error( 'Boxer is frozen - to assign value to Boxer please unfreeze it first.', {
      boxer: this
    } );
    console.trace();
  }


  return this;
};

/**
 *  Initialise property getter and setter to make it available to access by object like style
 *  eg myState.size = 1 instead of myState.$set('size', 1)
 *  However, if you target browser that doesn't support ES6 proxy it's better to always use $set method
 *
 *  @param key
 *  */
Boxer.prototype.$initProperty = function $initProperty( key ) {
  var descriptor = Object.getOwnPropertyDescriptor( this, key );

  if ( !descriptor || !descriptor.get ) {
    Object.defineProperty( this, key, {
      get: function () {
        return this._$$dataContainer.get( key );
      },
      set: function ( val ) {
        this.$set( key, val );
      }
    } );
  }

  return this;
};

/**
 *
 * Executes all functions in array with requested parameters
 *
 * @param eventsArray
 * @param key
 * @param newValue
 * @param oldValue
 * @param valueChanged
 * @param trigger
 * @private
 *
 */

Boxer.prototype._$$executeEvents = function _$$executeEvents( eventsArray, key, newValue, oldValue, valueChanged, trigger ) {
  var arr = eventsArray || []
    , arrLength = arr.length
    ;
  for ( var i = 0; i < arrLength; i++ ) {
    if ( arr[ i ] ) {
      var event = this._$$createEvent( key, newValue, oldValue, valueChanged, trigger, this, arr[ i ] )
        ;
      arr[ i ]( event );
    }
  }

  return this;
};

/**
 *
 * Creates event for event listener
 *
 * @param key
 * @param newValue
 * @param oldValue
 * @param valueChanged
 * @param trigger
 * @param element
 * @param listenerFn
 * @returns {{keyOfTrigger: *, newValue: *, oldValue: *, valueChanged: *, trigger: *, stateElement: *, listenerFn: *, destroyEventListener: Function}}
 * @private
 */
Boxer.prototype._$$createEvent = function _$$createEvent( key, newValue, oldValue, valueChanged, trigger, element, listenerFn ) {

  var _that = this;

  return {
    keyOfTrigger: key,
    newValue: newValue,
    oldValue: oldValue,
    valueChanged: valueChanged,
    trigger: trigger,
    stateElement: element,
    listenerFn: listenerFn,
    destroyEventListener: Boxer.prototype._$$removeEventListenerFactory( _that._$$eventListeners[ trigger ], listenerFn )
  };
};

/**
 *
 * Calls method that executes all events bound to property or events that are global
 *
 * @param key
 * @param newValue
 * @param oldValue
 * @param valueChanged
 * @private
 */

Boxer.prototype._$$fireEventListeners = function _$$fireEventListeners( key, newValue, oldValue, valueChanged ) {
  var commonEvents = this._$$eventListeners[ '__*__' ];
  this._$$executeEvents( commonEvents, key, newValue, oldValue, valueChanged, '__*__' );

  var customEvents = this._$$eventListeners[ key ];
  this._$$executeEvents( customEvents, key, newValue, oldValue, valueChanged, key );

};

/**
 *
 * Delete property - equivalent of Object.prototype.delete for Boxer
 *
 * @param key
 * @returns {Boxer}
 */

Boxer.prototype.$delete = function $delete( key ) {
  this.state.delete( key );
  if ( this._$$immutable ) {
    this._$$dataContainer = new Map( this.state );
  }

  this._$$fireEventListeners( key );

  return this;
};

/**
 *
 * Creates function which removes event from event array
 *
 * @param eventArray
 * @param fn
 * @returns {Function}
 * @private
 */

Boxer.prototype._$$removeEventListenerFactory = function _$$removeEventListenerFactory( eventArray, fn ) {

  return function () {
    var indexInArray = eventArray.indexOf( fn )
      , rest = eventArray.splice( indexInArray ).splice( 1 )
      ;
    eventArray.push.apply( eventArray, rest );
  }
};

/**
 *
 * Adds event to method
 * When first parameter is function and second is not present event will be added to global events
 * Global events are triggered every time when assignment happen
 *
 * @param arg1 - property name or fn
 * @param arg2 - optional - fn
 * @returns {Function}
 */

Boxer.prototype.$addEventListener = function $addEventListener( arg1, arg2 ) {

  var currentKey = arg1
    , currentFn = arg2
    ;

  if ( typeof currentKey === 'function' && !currentFn ) {
    currentKey = '__*__';
    currentFn = arg1;
  }

  if ( typeof currentFn !== 'function' ) {
    console.error( 'Invalid event listener type: ', typeof currentFn );
    return null;
  }

  if ( !(currentKey in this._$$eventListeners) ) {
    this._$$eventListeners[ currentKey ] = [];
  }
  this._$$eventListeners[ currentKey ].push( currentFn );
  return this._$$removeEventListenerFactory( this._$$eventListeners[ currentKey ], currentFn );
};

/**
 *
 * If key is present it will remove all events from events[key]
 * if not it will remove all events
 *
 * TODO: how memory leaks prevention can be improved?
 *
 * @param key
 * @returns {Boxer}
 */

Boxer.prototype.$removeEventListeners = function $removeAllEvents( key ) {
  /* remove events for requested key only */
  if ( typeof key !== 'undefined' ) {
    this._$$eventListeners[ key ].length = 0;

    /* remove all events */
  } else {
    for ( var key in this._$$eventListeners ) {
      this._$$eventListeners[ key ].length = 0;
    }
  }

  console.log( '$removeEventListeners', key, JSON.stringify( this._$$eventListeners ) );

  return this;
};

/**
 * Created by Unknown on 2016-09-02.
 */

'use strict';

describe( 'Boxer - unit tests.', function () {
  describe( 'Initialisation', function () {
    it( 'should init boxer with default settings', function () {

      var mybxr = new Boxer()
        ;

      expect( mybxr._$$name ).toEqual( '' ); // check if the name is correct
      expect( mybxr._$$registeredId ).toEqual( undefined ); // check if the id is correct
      expect( mybxr._$$immutable ).toBe( true ); // check if the immutability
      expect( mybxr._$$protected ).toBe( false ); // Phantom doesn't support ES6
    } );

    it( 'should init boxer with requested settings', function () {

      var mybxr = new Boxer( 'bxr2000', true, true, true )
        ;

      expect( mybxr._$$name ).toBe( 'bxr2000' ); // check if the name is correct
      expect( mybxr._$$registeredId ).toEqual( 0 ); // check if the id is correct
      expect( mybxr._$$immutable ).toBe( true ); // check if the immutability
      expect( mybxr._$$protected ).toBe( false ); // Phantom doesn't support ES6
    } );
  } );
  describe( 'Private methods and properties', function () {

    it( 'should store boxers in _$$boxerStore', function () {
      var bxr1 = new Boxer( 'a', true )
        , bxr2 = new Boxer( 'b', true )
        ;

      expect( Boxer.prototype._$$boxerStore.nextFreeId ).toEqual( 3 );
      expect( Object.keys( Boxer.prototype._$$boxerStore.boxers ).length ).toEqual( 3 );
    } );

    it( 'should register boxer in _$$boxerStore', function () {
      var bxr1 = new Boxer( 'c', false )
        ;

      Boxer.prototype._$$register( bxr1 );

      expect( bxr1._$$registeredId ).toEqual( 3 );
      expect( Boxer.prototype._$$boxerStore.boxers[ 3 ] ).toBe( bxr1 );
    } );

    it( 'should return true', function () {
      expect( Boxer.prototype._$$booleanOrTrue( 1 ) ).toBeTruthy();
    } );

    it( 'should return true', function () {
      expect( Boxer.prototype._$$booleanOrTrue( true ) ).toBeTruthy();
    } );

    it( 'should return false', function () {
      expect( Boxer.prototype._$$booleanOrTrue( false ) ).toBeFalsy();
    } );

    it( 'should return false in browser without ES6 Proxy support', function () {
      expect( Boxer.prototype._$$isProxySupported() ).toBeFalsy();
    } );

    it( 'should return false', function () {
      var bxr = new Boxer()
        ;
      expect( bxr._wasPropertyInitialized( 'x' ) ).toBeFalsy();
    } );

    it( 'should init property', function () {
      var bxr = new Boxer()
        ;

      bxr.$initProperty( 'x' );
      expect( bxr._wasPropertyInitialized( 'x' ) ).toBeTruthy();
    } );

    it( 'should init property', function () {
      var bxr = new Boxer()
        ;

      bxr.$set( 'x', 2 );
      expect( bxr._wasPropertyInitialized( 'x' ) ).toBeTruthy();
    } );

    it( 'should execute all functions in the array with parameters', function () {
      var bxr = new Boxer()
        , event1
        , event2
        ;

      bxr.$addEventListener( 'xxx', function ( ev ) {
        event1 = ev;
      } );

      bxr.$addEventListener( 'xxx', function ( ev ) {
        event2 = ev;
      } );

      bxr._$$executeEvents( bxr._$$eventListeners[ 'xxx' ], 'test', 1, 2, 'testVal', 'xxx' );

      expect( typeof event1 ).toEqual( 'object' );
      expect( typeof event2 ).toEqual( 'object' );
    } );

    it( 'should create event object', function () {
      var event = Boxer.prototype._$$createEventObject( 1, 2, 3, 4, 5, 6, 7 );

      expect( event ).toEqual( {
        keyOfTrigger: 1,
        newValue: 2,
        oldValue: 3,
        valueChanged: 4,
        trigger: 5,
        boxer: 6,
        listenerFn: 7,
        destroyEventListener: null
      } );
    } );

    it( 'should create event object', function () {
      var event = Boxer.prototype._$$createEventObject( 1, 2, 3, 4, 5, 6, 7 );

      expect( event ).toEqual( {
        keyOfTrigger: 1,
        newValue: 2,
        oldValue: 3,
        valueChanged: 4,
        trigger: 5,
        boxer: 6,
        listenerFn: 7,
        destroyEventListener: null
      } );
    } );

    it( 'should fire all events', function () {

      var bxr = new Boxer()
        , ev0
        , ev1
        , ev2
        , ev3
        ;

      bxr.$addEventListener( 'theFirstDodo', function ( ev ) {
        ev0 = ev;
      } );

      bxr.$addEventListener( 'theFirstDodo', function ( ev ) {
        ev1 = ev;
      } );

      bxr.$addEventListener( function ( ev ) {
        ev2 = ev;
      } );

      bxr.$addEventListener( function ( ev ) {
        ev3 = ev;
      } );

      bxr._$$fireEventListeners( 'theFirstDodo', 1, 2, 'Dodo' );

      expect( typeof ev0 ).toEqual( 'object' );
      expect( typeof ev1 ).toEqual( 'object' );
      expect( typeof ev2 ).toEqual( 'object' );
      expect( typeof ev3 ).toEqual( 'object' );

    } );

    it( 'should create function which will remove requested event from the array', function () {

      var arr = []
        , fn1 = function fn1() {}
        , fn2 = function fn2() {}
        , fn3 = function fn3() {}
        ;

      arr.push( fn1 );
      arr.push( fn2 );
      arr.push( fn3 );

      var removeFn = Boxer.prototype._$$removeEventListenerFactory( arr, fn2 );

      removeFn();

      expect( arr[ 0 ].name ).toEqual( 'fn1' );
      expect( arr[ 1 ].name ).toEqual( 'fn3' );

    } );

  } );
} );


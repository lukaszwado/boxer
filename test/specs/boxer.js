/**
 * Created by Unknown on 2016-09-02.
 */

'use strict';

describe( 'Boxer - unit tests.', function () {
  describe( 'Initialisation.', function () {
    it( 'should init boxer with default settings', function () {

      var bxr1 = new Boxer()
        ;

      expect( bxr1._$$name ).toEqual( '' ); // check if the name is correct
      expect( bxr1._$$registeredId ).toEqual( undefined ); // check if the id is correct
      expect( bxr1._$$immutable ).toBe( true ); // check if the immutability
      expect( bxr1._$$protected ).toBe( false ); // Phantom doesn't support ES6
    } );

    it( 'should init boxer with requested settings', function () {

      var bxr1 = new Boxer( { name: 'bxr2000', register: true, immutable: true, protect: true } )
        ;

      expect( bxr1._$$name ).toBe( 'bxr2000' ); // check if the name is correct
      expect( bxr1._$$registeredId ).toEqual( 0 ); // check if the id is correct
      expect( bxr1._$$immutable ).toBe( true ); // check if the immutability
      expect( bxr1._$$protected ).toBe( false ); // Phantom doesn't support ES6
    } );
  } );
  describe( 'Private methods and properties.', function () {

    it( 'should register boxer in _$$boxerStore', function () {
      var bxr1 = new Boxer( { name: 'c', register: true } )
        ;

      expect( Boxer.prototype._$$boxerStore.boxers[ bxr1._$$registeredId ] ).toBe( bxr1 );
    } );

    it( 'should return true', function () {
      expect( Boxer.prototype._$$booleanOrTrue( 1 ) ).toBe( true );
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
      expect( bxr._$$wasPropertyInitialized( 'x' ) ).toBeFalsy();
    } );

    it( 'should init property', function () {
      var bxr = new Boxer()
        ;

      bxr.$initProperty( 'x' );
      expect( bxr._$$wasPropertyInitialized( 'x' ) ).toBeTruthy();
    } );

    it( 'should init property', function () {
      var bxr = new Boxer()
        ;

      bxr.$set( 'x', 2 );
      expect( bxr._$$wasPropertyInitialized( 'x' ) ).toBeTruthy();
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
      var event = Boxer.prototype._$$createEventObject( 'kot', 'nv', 'ov', 'vc', 'eli' );

      expect( event ).toEqual( {
        keyOfTrigger: 'kot',
        newValue: 'nv',
        oldValue: 'ov',
        valueChanged: 'vc',
        eventListenerId: 'eli'
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

  } );

  describe( 'Public methods and properties.', function () {

    it( 'should return requested boxer', function () {

      var bxr1 = new Boxer( { name: 'Boxer 1', register: true } );
      var bxr2 = new Boxer( { name: 'Boxer 2', register: true } );
      var bxr3 = new Boxer( { name: 'Boxer 3', register: true } );
      var id1 = bxr1.$getId();
      var id2 = bxr2.$getId();
      var id3 = bxr3.$getId();

      expect( Boxer.prototype.$getBoxerById( id1 ) ).toBe( bxr1 );
      expect( Boxer.prototype.$getBoxerById( id2 ) ).toBe( bxr2 );
      expect( Boxer.prototype.$getBoxerById( id3 ) ).toBe( bxr3 );
    } );

    it( 'should return boxer name', function () {
      var bxr1 = new Boxer( { name: 'Cool Name 2000' } );
      expect( bxr1.$getName() ).toBe( 'Cool Name 2000' );
    } );

    it( 'should register boxer', function () {
      var bxr1 = new Boxer();

      expect( bxr1.$getId() ).toBe( undefined );

      bxr1.$register();

      expect( typeof bxr1.$getId() ).toBe( 'number' );
    } );

    it( 'should return boxer ID', function () {
      var bxr1 = new Boxer( { register: true } );
      expect( typeof bxr1.$getId() ).toBe( 'number' );
    } );

    it( 'should set boxer name', function () {
      var bxr1 = new Boxer();
      expect( bxr1.$getName() ).toBe( '' );
      bxr1.$setName( 'Name 2000 is Cool' )
      expect( bxr1.$getName() ).toBe( 'Name 2000 is Cool' );
    } );

    it( 'should freezer and unfreeze boxer', function () {
      var bxr1 = new Boxer();
      bxr1.$set( 'a', 2 );
      expect( bxr1.a ).toBe( 2 );
      bxr1.$freeze();
      bxr1.a = 3;
      bxr1.$set( 'a', 3 );
      expect( bxr1.a ).toBe( 2 );
      bxr1.$unfreeze();
      bxr1.a = 3;
      expect( bxr1.a ).toBe( 3 );
      expect( bxr1.$get( 'a' ) ).toBe( 3 );
    } );

    it( 'should return information about state of Boxer (frozen)', function () {
      var bxr1 = new Boxer();
      expect( bxr1.$isFrozen() ).toBe( false );
      bxr1.$freeze();
      expect( bxr1.$isFrozen() ).toBe( true );
      bxr1.$unfreeze();
      expect( bxr1.$isFrozen() ).toBe( false );
    } );

    it( 'should return false', function () {
      var bxr1 = new Boxer();
      expect( bxr1.$isProtected() ).toBe( false );
    } );

    it( 'should return requested value', function () {
      var bxr1 = new Boxer();
      bxr1.$set( 'aaa', 222 );
      expect( bxr1.$get( 'aaa' ) ).toBe( 222 );
    } );

    it( 'should refuse setting value', function () {
      var bxr1 = new Boxer();
      bxr1.$set( '_$$global', 222 );
      expect( bxr1.$get( '_$$global' ) ).toBe( undefined );
    } );

    it( 'should set value', function () {
      var bxr1 = new Boxer();
      bxr1.$set( 'xxx', 222 );
      expect( bxr1.xxx ).toBe( 222 );
    } );

    it( 'should initialise property getters and setters', function () {
      var bxr1 = new Boxer();
      bxr1.$initProperty( 'test' );

      var descriptor = Object.getOwnPropertyDescriptor( bxr1, 'test' );
      expect( descriptor.get ).toBeTruthy();
      expect( descriptor.set ).toBeTruthy();
      bxr1.test = 2;
      expect( bxr1.$get( 'test' ) ).toBe( 2 );
    } );

    it( 'should delete property', function () {
      var bxr1 = new Boxer();
      bxr1.$set( 'x', 2 );
      bxr1.$delete( 'x' );
      expect( bxr1.$get( 'x' ) ).toBe( undefined );
    } );

    it( 'should add event listeners as requested', function () {
      var bxr1 = new Boxer();
      var specificCallsCount = 0;
      var globalCallsCount = 0;
      bxr1.$addEventListener( 'x', function () {
        specificCallsCount++;
      } );
      bxr1.$addEventListener( function () {
        globalCallsCount++;
      } );

      bxr1.$set( 'x', 2 ); // specificCallsCount++, globalCallsCount++
      bxr1.$set( 'x2', 2 ); // globalCallsCount++

      expect( specificCallsCount ).toBe( 1 );
      expect( globalCallsCount ).toBe( 2 );
    } );

    it( 'should remove all eventListeners', function () {
      var bxr1 = new Boxer();
      var specificCallsCount = 0;
      var globalCallsCount = 0;
      bxr1.$addEventListener( 'x', function () {
        specificCallsCount++;
      } );
      bxr1.$addEventListener( function () {
        globalCallsCount++;
      } );

      bxr1.$set( 'x', 2 ); // specificCallsCount++, globalCallsCount++
      bxr1.$set( 'x2', 2 ); // globalCallsCount++

      expect( specificCallsCount ).toBe( 1 );
      expect( globalCallsCount ).toBe( 2 );

      bxr1.$removeEventListeners();

      bxr1.$set( 'x', 3 );
      bxr1.$set( 'x2', 4 );

      expect( specificCallsCount ).toBe( 1 );
      expect( globalCallsCount ).toBe( 2 );
    } );

    it( 'should remove all eventListeners bound to property `x`', function () {
      var bxr1 = new Boxer();
      var specificCallsCount = 0;
      var globalCallsCount = 0;
      bxr1.$addEventListener( 'x', function () {
        specificCallsCount++;
      } );
      bxr1.$addEventListener( function () {
        globalCallsCount++;
      } );

      bxr1.$set( 'x', 2 ); // specificCallsCount++, globalCallsCount++
      bxr1.$set( 'x2', 2 ); // globalCallsCount++

      expect( specificCallsCount ).toBe( 1 );
      expect( globalCallsCount ).toBe( 2 );

      bxr1.$removeEventListeners( 'x' );

      bxr1.$set( 'x', 3 );
      bxr1.$set( 'x2', 4 );

      expect( specificCallsCount ).toBe( 1 );
      expect( globalCallsCount ).toBe( 4 );
    } );

    it( 'should remove requested event only', function () {
      var bxr1 = new Boxer();
      var specificCallsCount = 0;
      var globalCallsCount = 0;
      var toRemoveCount = 0;
      bxr1.$addEventListener( 'x', function () {
        specificCallsCount++;
      } );
      bxr1.$addEventListener( function () {
        globalCallsCount++;
      } );

      var idToRemove = bxr1.$addEventListener( 'x', function () {
        toRemoveCount++;
      } ).split( '.' );

      bxr1.$set( 'x', 2 ); // specificCallsCount++, globalCallsCount++
      bxr1.$set( 'x2', 2 ); // globalCallsCount++

      expect( toRemoveCount ).toBe( 1 );
      expect( specificCallsCount ).toBe( 1 );
      expect( globalCallsCount ).toBe( 2 );

      bxr1.$removeEventListeners( idToRemove[ 0 ], idToRemove[ 1 ] );

      bxr1.$set( 'x', 3 );
      bxr1.$set( 'x2', 4 );

      expect( toRemoveCount ).toBe( 1 );
      expect( specificCallsCount ).toBe( 2 );
      expect( globalCallsCount ).toBe( 4 );
    } );

    it( 'should add multiple properties', function () {
      var bxr1 = new Boxer();

      bxr1.$setMultiple( {
        a: 1,
        b: 2
      } );

      expect( bxr1.a ).toBe( 1 );
      expect( bxr1.$get( 'b' ) ).toBe( 2 );

    } );


  } );
} );


const { expect } = require('chai');
const RailroadHelper = require('../Service/RailroadHelper');
const TrainStationService = require('../TrainStation/TrainStationService');
const UserService = require('../Users/UserService');





describe('encodePassword', () => {
    beforeEach(()=>{
        this.initialBody ={
            password:"somePassword",
        };
        this.endBody ={
            password:"somePassword",
        }
    })
    it('return an encrypted value of the key password of an object',()=>{
        expect(this.initialBody).to.be.an('object');
        expect(this.initialBody).to.have.property('password').that.is.a('string');
        RailroadHelper.encodePassword(this.initialBody);

        expect(this.initialBody).to.not.equal(this.endBody);
        
    })
 })

describe('verifyPassword', () => {
    beforeEach(()=>{
        this.body ={
            password:"pasword234",
        };
        this.pass ="pasword234";
        this.encBody= RailroadHelper.encodePassword(this.body);
        this.encPassword = this.encBody.password;
        
    })
    it('return true if the two password are equal after decrypted',()=>{
        expect(this.pass).to.be.an('string');
        expect(this.encPassword).to.be.an('string');

        expect(RailroadHelper.verifyPassword (this.pass, this.encPassword)).not.to.be.false;
        
    })
 })

describe('isEmailUnique', () => {
    beforeEach(()=>{
      
        this.email =null;
        this.validEmail= "data";
        
    })
    it('return true if email is not provided and false otherwise',()=>{
        expect(this.email).to.be.null;
        expect(this.validEmail).to.be.an('string');

        expect(RailroadHelper.isEmailUnique (this.email)).not.to.be.false;

        expect(RailroadHelper.isEmailUnique (this.validEmail)).not.to.be.true;
        
    })
 })

describe('createToken', () => {
    beforeEach(()=>{
      this.User = {
        email : 'node@gmail.com',
        role: "user"
      };
        
        
    })
    it('return a string encoded with Jason Web Token',()=>{
        expect(this.User.email).to.be.an('string');
        expect(this.User.role).to.be.an('string');

        expect(RailroadHelper.createToken (this.User,true)).to.be.an('string');

               
    })
 })
describe('checkPasswordValidity', () => {
    beforeEach(()=>{
      this.password = {
        valid : 'Pa3@check',
        notValid: "userOPu"
      };
        
        
    })
    it('return true if password is valid and false otherwise',()=>{
        expect(this.password.valid).to.be.an('string');
        expect(this.password.notValid).to.be.an('string');

        expect(RailroadHelper.checkPasswordValidity (this.password.valid)).not.to.be.false;
        expect(RailroadHelper.checkPasswordValidity (this.password.notValid)).not.to.be.true;

               
    })
 })
describe('validateUser', () => {
    beforeEach(()=>{
      this.user = {
        email : "Pa3@check.com",
        pseudo: "userOPu",
        password: "userOPu",
        role: "userOPu",
      };
   
        
        
    })
    it('return true if user data is valid and false otherwise',()=>{
        

        expect(RailroadHelper.validateUser (this.user).error).not.to.be.false;
       

               
    })
 })
describe('validateTrainStation', () => {
    beforeEach(()=>{
      this.trainStation = {
        name : 'Pa3@check',
        open_hour: "userOPu",
        close_hour: "userOPu",
        image: "userOPu",
      };
      this.trainStation1 = {
        email : 'Pa3@check',
        pseudo: "user",
        password: "userOPu",
        role: "us",
      };
        
        
    })
    it('return true if train station data is valid and false otherwise',()=>{
       

        
        expect(RailroadHelper.validateTrainStation (this.trainStation).error).not.to.be.false;

               
    })
 })
describe('UserService', () => {

    describe('createUser', () => { 
        
        beforeEach(()=>{
            this.user = {
                email : "Pa3@check.com",
                pseudo: "userOPu",
                password: "userOPu1@",
                role: "userOPu",
              };

           
       
            
            
        })
        it('return the user created if user data are correct',()=>{
           
            const user =  UserService.createUser(this.user);
            
            expect( user.then(data =>{ 
                data.toJSON().to.be.an('object')
            }));
    
                   
        })
       
    
    })
    describe('getThisUserByEmail', () => { 
        
        beforeEach(()=>{
            this.user = {
                email : "Pa3@check.com",
                pseudo: "userOPu",
                password: "userOPu1@",
                role: "userOPu",
              };

           
       
            
            
        })
        it('return the user given an user email is provided',()=>{
           
            const user =  UserService.getThisUserByEmail(this.user.email);
            
            expect( user.then(data =>{ 
                data.toJSON().to.be.an('object')
            }));
    
                   
        })
       
    
    })
    describe('getThisUserEmail', () => { 
        
        beforeEach(()=>{
            this.user = {
                email : "Pa3@check.com",
                pseudo: "userOPu",
                password: "userOPu1@",
                role: "userOPu",
              };

           
       
            
            
        })
        it('return the user email given an email is provided and the user exist',()=>{
           
            const user =  UserService.getThisUserEmail(this.user.email);
            
            expect( user.then(data =>{ 
                data.toJSON().email.to.be.an('email')
            }));
    
                   
        })
       
    
    })
    describe('getThisUserPseudo', () => { 
        
        beforeEach(()=>{
            this.user = {
                email : "Pa3@check.com",
                pseudo: "userOPu",
                password: "userOPu1@",
                role: "userOPu",
              };

           
       
            
            
        })
        it('return the user given an pseudo is provided and the user exist',()=>{
           
            const user =  UserService.getThisUserPseudo(this.user.pseudo);
            
            expect( user.then(data =>{ 
                data.toJSON().pseudo.to.be.an('string')
            }));
    
                   
        })
       
    
    })
    describe('getAll', () => { 
        
        beforeEach(()=>{
            this.user = {
                email : "Pa3@check.com",
                pseudo: "userOPu",
                password: "userOPu1@",
                role: "userOPu",
              };

           
       
            
            
        })
        it('return the all user object given users exist',()=>{
           
            const user =  UserService.getAll();
            
            expect( user.then(data =>{ 
                data.toJSON().pseudo.to.be.an('object')
            }));
    
                   
        })
       
    
    })
    describe('canUpdateAccount', () => { 
        
        beforeEach(()=>{
            this.user = {
                email : "Pa3@check.com",
                pseudo: "userOPu_again",
                password: "userOPu1@",
                role: "userOPu",
              };

           
       
            
            
        })
        it('return true is user account can be updated base on requirement given the user exist',()=>{
           
            const user =  UserService.canUpdateAccount(this.user);
            
            expect( user.then(data =>{
                data.to.equal(true);
            }) );
    
                   
        })
       
    
    })
 })
describe('TrainStationService', () => {

    describe('createTrainStation', () => { 
        
        beforeEach(()=>{
            this.station = {
                name : "Paris",
                open_hour: "2022-12-11T10:43:25",
                close_hour: "2022-12-14T10:43:25",
                image: {data:"userOPu"},
              };

           
       
            
            
        })
        it('return the train station created if station data are correct',()=>{
           
            const station =  TrainStationService.createTrainStation(this.station);
            
            expect( station.then(data =>{ 
                data.toJSON().to.be.an('object')
            }));
    
                   
        })
       
    
    })
    describe('getThisTrainStationByName', () => { 
        
        beforeEach(()=>{
            this.station = {
                name : "Paris",
                
              };

           
       
            
            
        })
        it('return the station given an station name is provided',()=>{
           
            const station =  TrainStationService.getThisTrainStationByName(this.station.name);
            
            expect( station.then(data =>{ 
                data.toJSON().to.be.an('object')
            }));
    
                   
        })
       
    
    })
    describe('getTrainStationSortByName', () => { 
        
        beforeEach(()=>{
            this.station = {
                name : "Paris",
               
              };

           
       
            
            
        })
        it('return the station sort by name if exist',()=>{
           
            const station =  TrainStationService.getTrainStationSortByName(this.station.name);
            
            expect( station.then(data =>{ 
                data.toJSON().to.be.an('object')
            }));
    
                   
        })
       
    
    })
   
    describe('getAll', () => { 
        
        beforeEach(()=>{
            this.station = {
                name : "Paris",
                
              };

           
       
            
            
        })
        it('return the all the train object given station exist',()=>{
           
            const station =  TrainStationService.getAll();
            
            expect( station.then(data =>{ 
                data.toJSON().to.be.an('object')
            }));
    
                   
        })
       
    
    })
    describe('canUpdateAccount', () => { 
        
        beforeEach(()=>{
            this.station = {
                name : "Paris",
               
              };

           
       
            
            
        })
        it('return true is station account can be updated base on requirement given the station exist',()=>{
           
            const station =  TrainStationService.canUpdateAccount(this.station);
            
            expect( station.then(data =>{
                data.to.equal(true);
            }) );
    
                   
        })
       
    
    })
 })


'use strict';

class Photo{
    
    constructor(id, name, thumb, src, created_time){
        this._id = id;
        this._name = name ? name.replace(/"/g, '\\"') : name;
        this._thumb = thumb;
        this._src = src;
        this._created_time = created_time;
    }
    
    get id(){
        return this._id;
    }
    set id(value){
        this._id = value;
    }
    
    get name(){
        return this._name;
    }
    set name(value){
        this._name = value;
    }
    
    get thumb(){
        return this._thumb;
    }
    set thumb(value){
        this._thumb = value;
    }
    
    get src(){
        return this._src;
    }
    set src(value){
        this._src = value;
    }
    
    get created_time(){
        return this._created_time;
    }
    set created_time(value){
        this._created_time = value;
    }
    
    toString(){
        return '{'
            + '"id": "' + this.id
            + '", "name": "' + this.name
            + '", "thumb": "' + this.thumb
            + '", "src": "' + this.src
            + '", "created_time": "' + this.created_time
            + '" }';
    }
    
}

module.exports = Photo;
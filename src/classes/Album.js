'use strict';

class Album{
    
    constructor(id, name, created_time){
        this._id = id;
        this._name = name ? name.replace(/"/g, '\\"') : name;
        this._created_time = created_time;
        this._photos = [];
    }
    
    static arrayToString(albums){
        return JSON.stringify(albums.map(album => album.toObject()));
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
    
    get created_time(){
        return this._created_time;
    }
    set created_time(value){
        this._created_time = value;
    }
    
    get photos(){
        return this._photos;
    }
    
    addPhoto(photo){
        this._photos.push(photo);
    }
    
    toObject(){
        return {
            id: this.id,
            name: this.name,
            created_time: this.created_time,
            photos: this.photos.map(photo => photo.toObject())
        };
    }
    
}

module.exports = Album;
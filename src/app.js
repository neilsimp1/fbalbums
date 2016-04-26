'use strict';

let Album = require('./classes/Album')
    , Photo = require('./classes/Photo')
    , config = require('./config')
    , bodyParser = require('body-parser')
	, express = require('express')
	, Facebook = require('facebook-node-sdk');

let app = express();
app.use(bodyParser.urlencoded({extended: true}));

let facebook = new Facebook(config);

app.get('/:userID/albums', function(req, res){
    let url = 'http://graph.facebook.com/' + req.params.userID
                + '?fields=albums.fields(id,name,created_time,photos.fields(id,name,picture,source,created_time).limit(5000))';
    facebook.api(url, function(err, data){
        let albums = [];
        if(err){
            console.error(err);
            res.sendStatus(502);
            res.end();
        }
        else{
            data.albums.data.forEach(function(_album){
                let album = new Album(_album.id, _album.name, _album.created_time);
                _album.photos.data.forEach(function(_photo){
                    album.addPhoto(new Photo(_photo.id, _photo.name, _photo.picture
                                    , _photo.source, _photo.created_time));
                });
                albums.push(album);
            });
        }
        
        let json = Album.arrayToString(albums);
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, {'Content-Type': 'application/json'});
        //console.log(json);
        res.end(json);
    });
});

app.get('/:userID/:albumID', function(req, res){
    let url = 'http://graph.facebook.com/' + req.params.userID + '/' + req.params.albumID
                + '?fields=id,name,created_time,photos.fields(id,name,picture,source,created_time).limit(5000))';//untested url
    facebook.api(url, function(err, data){
        let album;
        if(err){
            console.error(err);
            res.sendStatus(502);
            res.end();
        }
        else{
            album = new Album(data.id, data.name, data.created_time);
			data.photos.data.forEach(function(_photo){
				album.addPhoto(new Photo(_photo.id, _photo.name, _photo.picture
								, _photo.source, _photo.created_time));
			});
        }
        
        let json = album.toString();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, {'Content-Type': 'application/json'});
        //console.log(json);
        res.end(json);
    });
});

app.listen(process.env.port || 1337);
import * as bodyParser from "body-parser";
import * as express from "express";
import * as Facebook from "facebook-node-sdk";
import * as NodeCache from "node-cache";
import Album from "./classes/Album";
import Photo from "./classes/Photo";
import * as config from "./config";

const TIMEOUT: number = 60;

const app: any = express();
app.use(bodyParser.urlencoded({ extended: true }));

const facebook: Facebook = new Facebook(config);
const nodeCache: NodeCache = new NodeCache( { stdTTL: TIMEOUT });

const getUsersAlbums = async (req: any, res: any) => {
    const url: string = "http://graph.facebook.com/" + req.params.userId +
            "?fields=albums.fields(id,name,created_time,photos.fields(id,name,picture,source,created_time).limit(5000))";
    const albumIds: string[] = req.query["ids"] ? req.query["ids"].split(",") : null;
    
    const key: string = req.originalUrl;

    let albumsJson: string = await nodeCache.get(key);
    if(albumsJson){
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "Content-Type": "application/json" });
        //console.log(albumsJson);
        res.end(albumsJson);
    }
    else{
        facebook.api(url, (err, data): void => {
            let albums: Album[] = [];

            if(err) facebookApiErrorHandler(res, err);
            else albums = facebookApiSuccessHandler(albumIds, data);

            albumsJson = Album.albumArrayToJson(albums);

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { "Content-Type": "application/json" });
            //console.log(albumsJson);
            res.end(albumsJson);

            nodeCache.set(key, albumsJson);
        });
    }
};

const facebookApiErrorHandler = (res: any, err: any): void => {
    console.error(err);
    res.setHeader("Access-Control-Allow-Origin", "*");
	res.sendStatus(400);
	res.end();
};

const facebookApiSuccessHandler = (albumIds: string[], data: any): Album[] => {
	let albums: Album[] = [];
	data.albums.data.forEach((_album: any) => {
		if(albumIds && albumIds.indexOf(_album.id) !== -1) return;

		let album: Album = new Album(_album.id, _album.name, _album.created_time);
		if(_album.photos){
			album.photos = _album.photos.data.map((_photo: any): Photo => new Photo(_photo.id, _photo.name, _photo.picture, _photo.source, _photo.created_time));
			albums.push(album);
		}
	});

	return albums;
};

app.get("/:userId/albums", getUsersAlbums);

app.listen(process.env.port || 1337);

import * as bodyParser from "body-parser";
import * as express from "express";
import * as Facebook from "facebook-node-sdk";
import * as NodeCache from "node-cache";
import Album from "./classes/Album";
import Photo from "./classes/Photo";
import * as config from "./config";

const TIMEOUT = 60;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const facebook = new Facebook(config);
const nodeCache = new NodeCache( { stdTTL: TIMEOUT });

app.get("/:userId/albums", (req, res): void => {
    const url: string = "http://graph.facebook.com/" + req.params.userId +
            "?fields=albums.fields(id,name,created_time,photos.fields(id,name,picture,source,created_time).limit(5000))";
	const albumIds: string[] = req.query["ids"] ? req.query["ids"].split(",") : null;

    facebook.api(url, (err, data): void => {
		let albums: Album[] = [];

        if(err) facebookApiErrorHandler(res, err);
        else albums = facebookApiSuccessHandler(albumIds, data);

        const json = Album.arrayToString(albums);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "Content-Type": "application/json" });
        //console.log(json);
        res.end(json);
    });
});

const facebookApiErrorHandler = (res: any, err: any): void => {
	console.error(err);
	res.sendStatus(502);
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

app.listen(process.env.port || 1337);

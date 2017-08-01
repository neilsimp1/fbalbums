import Photo from "./Photo";

export default class Album {

	private _id: any;
	private _name: string;
	private _created_time: string;
	private _photos: Photo[] = [];

    public constructor(id: any, name: string, created_time: string) {
        this._id = id;
        this._name = name ? name.replace(/"/g, '\\"') : name;
        this._created_time = created_time;
    }

    public static arrayToString(albums) {
        return JSON.stringify(albums.map(album => album.toObject()));
    }

    public get id(): any { return this._id }
    public set id(value: any) { this._id = value }

    public get name(): string { return this.name }
    public set name(value: string) { this._name = value }

    public get created_time(): string { return this._created_time }
    public set created_time(value: string) { this._created_time = value }

    public get photos(): Photo[] { return this._photos }
    public set photos(value: Photo[]) { this._photos = value }

    public toObject(): any {
        return {
            id: this._id,
            name: this._name,
            created_time: this._created_time,
            photos: this._photos.map(photo => photo.toObject())
        };
    }

}

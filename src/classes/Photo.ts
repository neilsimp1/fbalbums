export default class Photo {

	private _id: any;
	private _name: string;
	private _thumb: string;
	private _src: string;
	private _created_time: string;
    
    public constructor(id, name, thumb, src, created_time) {
        this._id = id;
        this._name = name ? name.replace(/"/g, '\\"') : name;
        this._thumb = thumb;
        this._src = src;
        this._created_time = created_time;
    }
    
    public get id(): any { return this._id }
    public set id(value) { this._id = value }
    
    public get name(): string { return this._name }
    public set name(value) { this._name = value }
    
    public get thumb(): string { return this._thumb }
    public set thumb(value) { this._thumb = value }
    
    public get src(): string { return this._src }
    public set src(value) { this._src = value }
    
    public get created_time(): string { return this._created_time }
    public set created_time(value) { this._created_time = value }
    
    public toObject(): any {
        return {
            id: this.id,
            name: this.name,
            thumb: this.thumb,
            src: this.src,
            created_time: this.created_time
        };
    }
    
}

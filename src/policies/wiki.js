const ApplicationPolicy = require('./application');

module.exports = class WikiPolicy extends ApplicationPolicy {
    show(){
        return this._isAdmin() || (this._isPremium() && this._isOwner());
    }

    edit(){
        return this.user && this.record && (this._isAdmin() || this._isOwner());
    }

    update(){
        return this.edit();
    }

    destroy(){
        return this.user && this.record && (this._isOwner() || this._isAdmin());
    }
}
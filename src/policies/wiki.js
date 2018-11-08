const ApplicationPolicy = require('./application');

module.exports = class WikiPolicy extends ApplicationPolicy {
    show(){
        return this._isCollaborator() || this._isAdmin() || (this._isPremium() && this._isOwner());
    }

    edit(){
        return this.user && this.record && (this._isAdmin() || this._isOwner() || this._isCollaborator());
    }

    update(){
        return this.edit();
    }

    destroy(){
        return this.user && this.record && (this._isOwner() || this._isAdmin());
    }
}
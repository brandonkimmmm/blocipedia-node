const ApplicationPolicy = require('./application');

module.exports = class WikiPolicy extends ApplicationPolicy {
    show(){
        return this._isAdmin() || (this._isPremium() && (this.user.id === this.record.userId));
    }

    edit(){
        if(!this.record.private){
            return this.new() && this.record;
        }
    }

    update(){
        return this.edit();
    }

    destroy(){
        return this.record && (this._isOwner() || this._isAdmin());
    }
}
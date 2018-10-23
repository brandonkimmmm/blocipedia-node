const ApplicationPolicy = require('./application');

module.exports = class WikiPolicy extends ApplicationPolicy {
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
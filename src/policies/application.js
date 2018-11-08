module.exports = class ApplicationPolicy {
    constructor(user, record, collab){
        this.user = user;
        this.record = record;
        this.collab = collab;
    }

    _isOwner(){
        return this.user && this.record && (this.record.userId == this.user.id);
    }

    _isAdmin(){
        return this.user && this.user.role == 2;
    }

    _isPremium(){
        return this.user && this.user.role == 1;
    }

    _isCollaborator(){
        let isCollab = false;
        if(this.collab.length !== 0){
            this.collab.forEach((collab) => {
                if(collab.userId == this.user.id){
                    isCollab = true;
                }
            });
        }
        return this.user && this.record && this.collab && isCollab;
    }

    new(){
        return this.user !== null;
    }

    create(){
        return this.new();
    }

    show(){
        return true;
    }
}
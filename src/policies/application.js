module.exports = class ApplicationPolicy {
    constructor(user, record){
        this.user = user;
        this.record = record;
    }

    _isOwner(){
        return this.record && (this.record.userId == this.user.id);
    }

    _isAdmin(){
        return this.user && this.user.role == 1;
    }

    _isPremium(){
        return this.user && this.user.role == 2;
    }

    new(){
        // console.log('this is in the policy/application file', this.user);
        return this.user != null;
    }

    create(){
        return this.new();
    }

    show(){
        return true;
    }
}
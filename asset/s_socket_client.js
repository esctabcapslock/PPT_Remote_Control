// url 예시:: 10.171.23.43/socket/ 이렇게...
class S_Socket_Client {

    constructor(name, url, callback) {
        this.name = name;
        this.url = url;
        this.checker(callback);
    }

    checker(callback) {
        fetch(this.url).then((data) => {
            return data.text()
        }).then((data) => {
                callback(data);
                this.checker(callback);
            })
    }
}

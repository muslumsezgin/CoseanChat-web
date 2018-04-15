import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Chat.css';
import {emit} from "./WebSocketHelper";

class App extends Component {

    state = {
        my_ip: '',
        my_info: null,
        img: '',
        file: null,
        talkId: 0,
        value: '',
        notificationSet: [],
        onlineSet: [],
        pendingSet: [],
        requestSet: [],
        confirmSet: [],
        userSet: {},
        messageList: {'s': []},
        globalSocket: null,
        messageSocket: null,
    };

    scrollToBottom = () => {
        if (this.state.my_info !== null) {
            const messagesContainer = ReactDOM.findDOMNode(this.messagesContainer);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    _send() {
        const {value, talkId, my_ip, confirmSet, onlineSet, messageSocket} = this.state;
        if (talkId !== my_ip && onlineSet.find(e => e === talkId) && confirmSet.find(e => e === talkId) && value.trim()) {
            this.setState({value: ''}, () => messageSocket.send(JSON.stringify({
                from: my_ip,
                to: talkId,
                content: value
            })))
        }
    }

    register = () => {
        let payload = {};
        payload.method = 'POST';
        payload.headers = {'Content-Type': 'application/json'};
        payload.body = JSON.stringify(this.state.my_info);
        fetch('http://192.168.43.48:9093/api/v1/user', payload).then(res => res.text()).then(e => {
            this.setState({
                my_ip: e, talkId: e,
                globalSocket: emit("ws://192.168.43.48:9093/api/online/" + e, (item) => this.setState({...item})),
                messageSocket: emit("ws://192.168.43.48:9093/api/chat?ip=" + e, (mes) => {
                    const ip = mes.to === this.state.my_ip ? mes.from : mes.to;
                    const notification = ip !== this.state.talkId;
                    const messageList = {
                        ...this.state.messageList,
                        [ip]: this.state.messageList[ip] !== undefined ? [...this.state.messageList[ip], mes] : [mes]
                    };
                    const notificationSet = notification ? [...this.state.notificationSet, ip] : this.state.notificationSet;
                    this.setState({messageList, notificationSet})
                })
            })
        }).catch(err => this.setState({my_info: null}))
    }

    pictureUpload = (file) => {
        var data = new FormData()
        data.append('file', file)
        let payload = {};
        payload.method = 'POST';
        payload.headers = {};
        payload.body = data;
        fetch('http://192.168.43.48:9093/api/v1/upload', payload).then(res => res.text()).then(e => this.setState({img: e}))
            .catch(err => this.setState({my_info: null}))
    }

    request = (ownIp) => {
        let payload = {};
        payload.method = 'POST';
        payload.headers = {'Content-Type': 'application/json'};
        payload.body = JSON.stringify({ip: ownIp});
        fetch('http://192.168.43.48:9093/api/v1/user/request', payload)
            .then(e => e.status === 200 && this.setState({requestSet: [...this.state.requestSet, ownIp]}))
            .catch(err => console.log("hata"))
    }

    confirm = (ownIp) => {
        let payload = {};
        payload.method = 'POST';
        payload.headers = {'Content-Type': 'application/json'};
        payload.body = JSON.stringify({ip: ownIp});
        fetch('http://192.168.43.48:9093/api/v1/user/confirm', payload)
            .then(e => e.status === 200 && this.setState({confirmSet: [...this.state.requestSet, ownIp]}))
            .catch(err => console.log("hata"))
    }

    logout() {
        this.state.globalSocket && this.state.globalSocket.close();
        this.setState({my_info: null})
    }

    renderContent() {
        const {talkId, userSet, my_info, onlineSet, pendingSet, requestSet, confirmSet, my_ip, messageList} = this.state;
        const selected = talkId !== my_ip;
        if (selected) {
            const person = userSet[talkId];
            const online = onlineSet.find(item => item === talkId);
            if (online) {
                if (confirmSet.find(item => item === talkId)) {
                    const talkMessages = messageList[Object.keys(messageList).find(item => item === talkId)];
                    const messages = talkMessages ? talkMessages : [];
                    return messages.length === 0 ? <div className='my-page'>
                        {person.profilePicture ?
                            <img className='profile-image' alt={person.nickName} src={person.profilePicture}/> :
                            <h2 className='profile-image-large large-name'>{person.nickName.charAt(0).toUpperCase()}</h2>}
                        <h1 className='my-text'>{person.nickName}</h1>
                        <label>Hadi {person.nickName} için bir mesaj yaz...</label>
                    </div> : messages.map((e, i) =>
                        <div key={i} className={e.from === my_ip ? 'messages-li-me' : 'messages-li'}>{e.content}</div>)
                } else if (requestSet.find(item => item === talkId)) {
                    return <div className='my-page'>
                        {person.profilePicture ?
                            <img className='profile-image' alt={person.nickName} src={person.profilePicture}/> :
                            <h2 className='profile-image-large large-name'>{person.nickName.charAt(0).toUpperCase()}</h2>}
                        <h1 className='my-text'>{person.nickName}</h1>
                        <label>{person.nickName} kullanıcısına konuşma isteği gönderildi. Kabul ettikten sonra doya doya
                            sohbet edebilirsin.</label>
                    </div>
                } else if (pendingSet.find(item => item === talkId)) {
                    return <div className='my-page'>
                        {person.profilePicture ?
                            <img className='profile-image' alt={person.nickName} src={person.profilePicture}/> :
                            <h2 className='profile-image-large large-name'>{person.nickName.charAt(0).toUpperCase()}</h2>}
                        <h1 className='my-text'>{person.nickName}</h1>
                        <label>{person.nickName} kullanıcısından isteğin var. Kabul ettikten sonra doya doya sohbet
                            edebilirsin.</label>
                        <button className="pending" onClick={() => this.confirm(talkId)}>Onayla</button>
                    </div>
                } else {
                    return <div className='my-page'>
                        {person.profilePicture ?
                            <img className='profile-image' alt={person.nickName} src={person.profilePicture}/> :
                            <h2 className='profile-image-large large-name'>{person.nickName.charAt(0).toUpperCase()}</h2>}
                        <h1 className='my-text'>{person.nickName}</h1>
                        <label>Hadi ne bekliyorsun! {person.nickName} kullanıcısına konuşma isteği göndermek için butona
                            tıkla.</label>
                        <button className="pending" onClick={() => this.request(talkId)}>İstek At</button>
                    </div>
                }
            } else {
                return <div className='my-page'>
                    {person && person.profilePicture && person.nickName &&
                    <img className='profile-image' alt={person.nickName} src={person.profilePicture}/>}
                    {person && !person.profilePicture && person.nickName &&
                    <h2 className='profile-image-large large-name'>{person.nickName.charAt(0).toUpperCase()}</h2>}
                    {person && person.nickName && <h1 className='my-text'>{person.nickName}</h1>}
                    <label>Çevrimdışı olan kullanıcılar ile mesajlaşamazsınız. Kullanıcı yeniden aktif olduğu zaman
                        dilediğiniz gibi konuşabilirsiniz. </label>
                    <h1>ÇEVRİMDIŞI</h1>
                </div>
            }
        } else {
            return <div className='my-page'>

                {my_info.profilePicture ?
                    <img className='profile-image' alt={my_info.nickName} src={my_info.profilePicture}/> :
                    <h2 className='profile-image-large large-name'>{my_info.nickName.charAt(0).toUpperCase()}</h2>}
                <h1 className='my-text'>{my_info.nickName}</h1>
                <label>Cosean Mesajlaşma Uygulaması portalda bulunan kişilerle doya doya konuşmanı sağlamak için
                    geliştirilmiştir. <a href={"http://cosean.me"}>Web sitemize</a> gidip diğer uygulamalarımızı
                    görebilir. Bu tür geliştirimlerin devamı için bağışta bulunabilirsiniz.
                    <hr/>Cosean Corp.<br/>Müslüm Sezgin - Anıl Coşar
                </label>
                <button className="pending" onClick={() => this.logout()}>Çıkış Yap</button>
            </div>
        }
    }

    renderStatus(ip) {
        const {onlineSet, pendingSet, requestSet, confirmSet} = this.state;
        const online = onlineSet.find(item => item === ip);
        if (online) {
            if (pendingSet.find(item => item === ip))
                return <i className="fa fa-bell lock" style={{right: "25px"}}/>
            else if (requestSet.find(item => item === ip))
                return <i className="fa fa-clock-o lock" style={{right: "26px", bottom: "29px"}}/>
            else if (confirmSet.find(item => item === ip))
                return <div className='green' style={{right: "26px"}}/>
            return <i className="fa fa-lock lock" style={{right: "27px"}}/>
        }
        // return <div className='green' style={{right: "26px",borderColor:"#eee"}}/>
    }

    render() {
        const {value, talkId, userSet, my_info, img, notificationSet} = this.state;
        if (my_info === null)
            return <div className='login my-page'>
                <div>
                    <img className='profile-image' style={{position: 'absolute'}} alt='' src={img}/>
                    <div className="input-file-container">
                        <input className="input-file" id="my-file" type="file" accept="image/*"
                               onChange={(e) => this.pictureUpload(e.target.files[0])}/>
                        <h1 tabIndex="0" className="input-file-trigger">+</h1>
                    </div>
                    <p className="file-return"/>
                </div>
                <input
                    className='input'
                    onKeyPress={e => e.key === 'Enter' && value.trim() && this.setState({
                        my_info: {
                            nickName: value,
                            profilePicture: img
                        }, value: ''
                    }, () => this.register())}
                    type='text'
                    value={value}
                    onChange={(e) => this.setState({value: e.currentTarget.value})}
                    placeholder="takma isim"
                    style={{margin: '20px'}}
                />
                <button className="pending"
                        onClick={() => value.trim() && this.setState({
                            my_info: {nickName: value, profilePicture: img},
                            value: ''
                        }, () => this.register())}>
                    Giriş
                </button>
            </div>;
        return (
            <div className='content'>
                <div className='list'>
                    <button className='my'
                            onClick={() => this.setState({value: '', talkId: this.state.my_ip})}
                    >
                        {my_info.profilePicture ?
                            <img className='profile-image' alt={my_info.nickName} src={my_info.profilePicture}/> :
                            <label className='profile-image name'>{my_info.nickName.charAt(0).toUpperCase()}</label>}
                        <label className='my-text'>{my_info.nickName}</label>
                    </button>

                    <div className='other'>
                        {Object.keys(userSet).map((e, index) => e !== this.state.my_ip &&
                            <button key={index} className={e === talkId ? 'button active' : 'button'}
                                    onClick={() => {
                                        let notSet = notificationSet;
                                        notSet.splice(notificationSet.indexOf(e), 1);
                                        this.setState({value: '', talkId: e, notificationSet: notSet})
                                    }}
                                    type="button">
                                {notificationSet.find(n => e === n) && <i className="fa fa-envelope-o message-icon"/>}
                                {userSet[e].profilePicture ?
                                    <img className={'profile-image'} alt={userSet[e].nickName}
                                         src={userSet[e].profilePicture}/> :
                                    <label
                                        className='profile-image name'>{userSet[e].nickName.charAt(0).toUpperCase()}</label>}
                                <label className='other-text'>{userSet[e].nickName}</label>
                                <div>
                                    <div className='online-img'/>
                                    {this.renderStatus(e)}
                                </div>
                            </button>
                        )}
                    </div>
                </div>
                <div className='messages' ref={el => this.messagesContainer = el}>{this.renderContent()}</div>
                <div className='send'>
                    <input className='input'
                           onKeyPress={(e) => e.key === 'Enter' && this._send()}
                           type='text'
                           value={value}
                           onChange={(e) => this.setState({value: e.currentTarget.value})}
                           placeholder={"bir mesaj yaz..."}
                    />
                    <button className='button-send' onClick={() => this._send()}>Gönder</button>
                </div>
            </div>
        );
    }
}

export default App;

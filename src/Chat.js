import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Chat.css';
import {emit} from "./WebSocketHelper";

var address = require('address');

/*const defaultMess = [
    {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        me: true
    },
    {
        text: 'Maecenas erat justo, vehicula quis pretium vitae, dignissim eget ante. Aliquam malesuada vitae felis ut dictum. ',
        me: false
    },
    {
        text: 'Morbi vitae purus ac quam vestibulum eleifend eu vitae orci. Etiam id tempor mauris. Quisque tristique, enim pellentesque blandit tristique, mauris tortor ullamcorper turpis, non vehicula nunc neque nec justo. Aliquam blandit sed nisl sit amet dignissim.',
        me: false
    },
    {
        text: 'Curabitur sem dui, molestie a nunc a, suscipit aliquet risus. Nulla arcu enim, venenatis ac lectus non, mollis cursus ligula. Nulla et eros felis. Etiam malesuada eu sapien ac gravida. Aliquam vulputate, ante id fermentum hendrerit, ligula nulla tempus dolor, sit amet dictum erat nulla a nibh.',
        me: true
    },
    {
        text: 'Ut rhoncus sit amet elit et volutpat. Phasellus id porta est. Ut lectus nibh, venenatis non commodo ut, elementum et mauris.',
        me: false
    },
    {
        text: 'Aliquam nec volutpat ipsum. Donec placerat augue et urna malesuada auctor.',
        me: false
    },
    {
        text: 'Aliquam quis augue vitae tellus convallis eleifend. Pellentesque sed posuere dui. Vivamus suscipit dignissim nunc, quis bibendum sapien placerat ac.',
        me: true
    },
    {
        text: 'Cras commodo arcu.',
        me: false
    },
    {
        text: 'sorry.',
        me: false
    },
    {
        text: 'wtf :/',
        me: true
    },
];*/

const VisibleType = {
    LOCK: 0,
    INACTIVE: 1,
    ONLINE: 2,
    PENDING: 3,
};

class App extends Component {

    state = {
        my_ip:'',
        my_info: null,
        img: '',
        file: null,
        talkId: 0,
        value: '',
        onlineSet: [],
        pendingSet: [],
        requestSet: [],
        confirmSet: [],
        userList: {}

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

    componentWillMount(){

    }

    _send() {
        const {value, talkId, userList} = this.state;
        /*if (talkId !== 0 && userList[talkId].status === VisibleType.ONLINE && value.trim()) {
            this.setState({
                userList: {
                    ...userList,
                    [talkId]: {
                        ...userList[talkId],
                        messages: [...userList[talkId].messages, {text: this.state.value, me: true}]
                    }
                },
                value: ''
            })
        }*/
    }

    register = () => {
        this.setState({loading: true});
        let payload = {};
        payload.method = 'POST';
        payload.headers = {'Content-Type': 'application/json'};
        payload.body = JSON.stringify(this.state.my_info);
        // fetch('http://127.0.0.1:9093/api/v1/user', payload)
        fetch('http://192.168.43.231:9093/api/v1/user', payload)
            .then(res => res.text()).then(e => this.setState({my_ip:e, talkId:e},
            () => emit("ws://192.168.43.231:9093/api/online/", this.state.my_ip, (item)=>this.setFunc(item))))
            .catch(err => console.log("hata"))

    }

    renderContent() {
        const {talkId, userList, my_info, onlineSet, pendingSet, requestSet, confirmSet, my_ip} = this.state;
        const selected = talkId !== my_ip;
        if (selected) {
            const person = userList[talkId];
            const online = onlineSet.find(item => item === talkId);
            if (online) {
                if (confirmSet.find(item => item === talkId)) {
                    return person.messages.length === 0 ? <div className='my-page'>
                        <img className='profile-image' alt={person.name} src={person.img}/>
                        <h1 className='my-text'>{person.name}</h1>
                        <label>Hadi {person.name} için bir mesaj yaz...</label>
                    </div> : person.messages.map(e => <div
                        className={e.me ? 'messages-li-me' : 'messages-li'}>{e.text}</div>)
                } else if (requestSet.find(item => item === talkId)) {
                    return <div className='my-page'>
                        <img className='profile-image' alt={person.name} src={person.img}/>
                        <h1 className='my-text'>{person.name}</h1>
                        <label>{person.name} kullanıcısına konuşma isteği gönderildi. Kabul ettikten sonra doya doya
                            sohbet
                            edebilirsin.</label>
                    </div>
                } else if (pendingSet.find(item => item === talkId)) {
                    return <div className='my-page'>
                        <img className='profile-image' alt={person.name} src={person.img}/>
                        <h1 className='my-text'>{person.name}</h1>
                        <label>{person.name} kullanıcısından isteğin var. Kabul ettikten sonra doya doya
                            sohbet
                            edebilirsin.</label>
                    </div>
                } else {
                    return <div className='my-page'>
                        <img className='profile-image' alt={person.name} src={person.img}/>
                        <h1 className='my-text'>{person.name}</h1>
                        <label>Hadi ne bekliyorsun! {person.name} kullanıcısına konuşma isteği göndermek için butona
                            tıkla.</label>
                        <button className="pending">Click me</button>
                    </div>
                }
            }
        } else {
            return <div className='my-page'>
                <img className='profile-image' alt={my_info.name} src={my_info.img}/>
                <h1 className='my-text'>{my_info.name}</h1>
                <label>Lorem ipsum dolor sit amet, quot adolescens duo at, mel omittam maluisset ex. Eam homero
                    inimicus ut, cotidieque contentiones in mea. Has ne omnis velit iuvaret. At omnes essent
                    assueverit per, porro euripidis intellegebat ad vix. Cum illud pertinacia ut, et ius tempor
                    primis indoctum, mea falli percipitur ea.</label>
            </div>
        }
    }

    render() {
        const {value, talkId, userList, my_info, img} = this.state;
        if (my_info === null)
            return <div className='login my-page'>
                <div>
                    <img className='profile-image' style={{position: 'absolute'}} alt='' src={img}/>
                    <div className="input-file-container">
                        <input className="input-file" id="my-file" type="file" accept="image/*"
                               onChange={(e) => {
                                   let reader = new FileReader();
                                   let file = e.target.files[0];

                                   reader.onloadend = () => {
                                       this.setState({
                                           file,
                                           img: reader.result
                                       });
                                   };
                                   reader.readAsDataURL(file)
                               }}
                        />
                        <h1 tabIndex="0" className="input-file-trigger">+</h1>
                    </div>
                    <p className="file-return"/>
                </div>
                <input
                    className='input'
                    onKeyPress={e => e.key === 'Enter' && value.trim()
                        && this.setState({
                            my_info: {nickName: value, profilePicture:img},
                            value: ''
                        }, () => this.register())}
                    type='text'
                    value={value}
                    onChange={(e) => this.setState({value: e.currentTarget.value})}
                    placeholder="nickname"
                    style={{margin: '20px'}}
                />
                <button className="pending"
                        onClick={() => value.trim() && this.setState({
                            my_info: {nickName: value, profilePicture:img},
                            value: ''
                        }, () => this.register())}>
                    Enter
                </button>
            </div>;
        return (
            <div className='content'>
                <div className='list'>
                    <div className='my'>
                        <img className='profile-image' alt={my_info.nickName} src={my_info.img}/>
                        <label className='my-text'>{my_info.nickName}</label>
                    </div>

                    <div className='other'>

                        {Object.keys(userList).map((e, index) => e !== this.state.my_ip &&
                            <button key={index} className={e === talkId ? 'button active' : 'button'}
                                    onClick={() => this.setState({value: '', talkId: e})}
                                    type="button">
                                <img className={'profile-image' + (e === talkId ? ' online' : '')}
                                     alt={userList[e].nickName}
                                     src={userList[e].profilePicture}/>
                                <label className='other-text'>{userList[e].nickName}</label>
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
                           placeholder={"write a message..."}
                    />
                    <button className='button-send' onClick={() => this._send()}>SEND</button>
                </div>
            </div>
        );
    }

    setFunc(item) {
        const {onlineSet,pendingSet,requestSet,confirmSet,userSet}=item
        this.setState({onlineSet,pendingSet,requestSet,confirmSet,userList:userSet})
    }

    renderStatus(ip) {
        const { onlineSet, pendingSet, requestSet, confirmSet} = this.state;
        const online = onlineSet.find(item => item === ip);
        if(online){
            if(pendingSet.find(item => item === ip))
                return  <i className="fa fa-clock-o lock"/>
            else if(requestSet.find(item => item === ip))
                return  <i className="fa fa-clock-o lock"/>
            else if(confirmSet.find(item => item === ip))
                return  <i className="fa fa-lock lock"/>
            return <div className='green'/>
        }
    }
}

export default App;

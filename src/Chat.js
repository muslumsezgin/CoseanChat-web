import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Chat.css';

const defaultMess = [
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
];

const VisibleType = {
    LOCK: 0,
    INACTIVE: 1,
    ONLINE: 2,
    PENDING: 3,
};

class App extends Component {

    state = {
        my_info: null,
        img: '',
        file: null,
        talkId: 0,
        value: '',
        userList: {
            1: {
                img: 'https://cdnb.artstation.com/p/assets/images/images/001/863/575/large/irakli-nadar-artstation-da.jpg?1453903033',
                name: 'Shuri',
                messages: defaultMess,
                status: 0
            },
            2: {
                img: 'http://akns-images.eonline.com/eol_images/Entire_Site/201675/rs_300x300-160805111549-600-suicide-squad-margot-robbie.jpg?fit=around|700:700&crop=700:700;center,top&output-quality=100',
                name: 'Margot',
                messages: defaultMess,
                status: 1
            },
            4: {
                img: 'https://geekyapar.com/wp-content/uploads/2014/10/Scarlett-Johansson-hot-in-white-shirt.jpg',
                name: 'Scarlett',
                messages: [],
                status: 2
            },
            5: {
                img: 'https://specials-images.forbesimg.com/imageserve/dc687b7c5b56481d04dcfcdbe5723c66/416x416.jpg?background=000000&cropX1=2&cropX2=664&cropY1=6&cropY2=668',
                name: 'Maria',
                messages: [],
                status: 3
            },
        }
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
        const {value, talkId, userList} = this.state;
        if (talkId !== 0 && userList[talkId].status === VisibleType.ONLINE && value.trim()) {
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
        }
    }

    renderContent() {
        const {talkId, userList, my_info} = this.state;
        const selected = talkId !== 0;
        if (selected) {
            const person = userList[talkId];
            if (person.status === VisibleType.LOCK) {
                return <div className='my-page'>
                    <img className='profile-image' alt={person.name} src={person.img}/>
                    <h1 className='my-text'>{person.name}</h1>
                    <label>Hadi ne bekliyorsun! {person.name} kullanıcısına konuşma isteği göndermek için butona
                        tıkla.</label>
                    <button className="pending">Click me</button>
                </div>
            } else if (person.status === VisibleType.PENDING) {
                return <div className='my-page'>
                    <img className='profile-image' alt={person.name} src={person.img}/>
                    <h1 className='my-text'>{person.name}</h1>
                    <label>{person.name} kullanıcısına konuşma isteği gönderildi. Kabul ettikten sonra doya doya sohbet
                        edebilirsin.</label>
                </div>
            } else {
                return person.messages.length === 0 ? <div className='my-page'>
                    <img className='profile-image' alt={person.name} src={person.img}/>
                    <h1 className='my-text'>{person.name}</h1>
                    <label>Hadi {person.name} için bir mesaj yaz...</label>
                </div> : person.messages.map(e => <div
                    className={e.me ? 'messages-li-me' : 'messages-li'}>{e.text}</div>)
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
                        <h1 tabindex="0" className="input-file-trigger">+</h1>
                    </div>
                    <p className="file-return"/>
                </div>
                <input
                    className='input'
                    onKeyPress={e => e.key === 'Enter' && value.trim()
                        && this.setState({my_info: {name: value, img}, value: ''})}
                    type='text'
                    value={value}
                    onChange={(e) => this.setState({value: e.currentTarget.value})}
                    placeholder="nickname"
                    style={{margin: '20px'}}
                />
                <button className="pending"
                        onClick={() => value.trim() && this.setState({my_info: {name: value, img}, value: ''})}>
                    Enter
                </button>
            </div>;

        return (
            <div className='content'>
                <div className='list'>
                    <div className='my'>
                        <img className='profile-image' alt={my_info.name} src={my_info.img}/>
                        <label className='my-text'>{my_info.name}</label>
                    </div>

                    <div className='other'>
                        {Object.entries(userList).map(e =>
                            <button className={e[0] === talkId ? 'button active' : 'button'}
                                    onClick={() => this.setState({value: '', talkId: e[0]})}
                                    type="button">
                                <img className={'profile-image' + (e[0] === talkId ? ' online' : '')} alt={e[1].name}
                                     src={e[1].img}/>
                                <label className='other-text'>{e[1].name}</label>
                                <div>
                                    <div className='online-img'/>
                                    {e[1].status === VisibleType.LOCK && <i className="fa fa-lock lock"/>}
                                    {e[1].status === VisibleType.PENDING && <i className="fa fa-clock-o lock"/>}
                                    {e[1].status === VisibleType.ONLINE && <div className='green'/>}
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
}

export default App;

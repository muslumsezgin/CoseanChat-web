import React, {Component} from 'react';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className='main2'>
                <div>
                    <form className={'formImage'}>
                        <div className="input-file-container">
                            <input className="input-file" id="my-file" type="file"/>
                                <label tabindex="0" className="input-file-trigger">Select a profile picture...</label>
                        </div>
                        <p className="file-return"/>
                    </form>

                    <label class="fileContainer">
                        Click here to trigger the file uploader!
                        <input type="file"/>
                    </label>
                </div>
            </div>
        );
    }
}

export default App;

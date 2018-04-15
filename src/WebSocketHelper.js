export function emit(socket,setFunc) {
    let ws = new WebSocket(socket);

    ws.onopen = () =>(res => {
        if (ws.readyState === ws.OPEN) {
            console.log("Bağlantı sağlandi")
            if (res.error) {
                console.log("error")
                ws.close();
            }
            else {
                console.log("Bağlantı sağlandi")
            }
        }
    });


    ws.onmessage = (e) => {
        // console.log('message', e.data);
        setFunc(JSON.parse(e.data))
    };

    ws.onerror = (e) => {
        console.log('error ws')
    };
    ws.onclose = (e) => {
        console.log('close ws')
    };
    return ws;
}
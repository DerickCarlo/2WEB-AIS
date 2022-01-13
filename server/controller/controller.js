//Generate Transaction Report
fetch('https://api.xendit.co/reports',{
    method: 'POST',
    body: JSON.stringify({
        type: "TRANSACTIONS",
        filter:{
            from: "2021-09-23T04:01:55.574Z",
            to: "2021-11-24T04:01:55.574Z"
        },
        format: "CSV",
        currency: "PHP",
    }),
    headers:{
        "Content-Type":"application/json; charset=UTF-8"
    }
})
.then(function(response){
    return response.json()
})
.then(function(data){
    console.log(data)
})
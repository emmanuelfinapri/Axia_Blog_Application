async function postIt() {
    const response = await fetch('http://localhost:3000/post', {
        method: 'POST',
        body: JSON.stringify({name: 'Emmanuel', married: 'false', age:20 }), // the JSON.stringify() converts the normal object to JSON 
    })
    const result = await response.json()
    console.log(result)

}

postIt()
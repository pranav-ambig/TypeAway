
function comm(){
	const options = {
		hostname: '0.0.0.0',
		port: 8081,
		method: 'GET',
		url: new URL("http://localhost:8081/idk")
	  }

	let req = new http.request(options, res=>{
		res.on('data', (data)=>{
			console.log(data)
		})
	})
	req.end()
	console.log('req sent')
}
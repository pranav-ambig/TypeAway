coords = [[50, 50], [200, 50], [200, 200], [550, 200], [550, 50], [400, 50], [400, 400], [50, 400]]


len = 0
prev = [0, 0]
coords.forEach((i)=>{
	len += Math.sqrt((i[0]-prev[0])**2+(i[1]-prev[1])**2)
	prev = i
})
console.log(len)

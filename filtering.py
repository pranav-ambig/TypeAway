with open('words.txt') as f:
	l = f.readlines()
	with open('words2.txt', 'a') as f2:
		for i in l:
			if (len(i[:-1])>2):
				f2.write(i)
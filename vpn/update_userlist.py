import redis

def update_ul():
	with open('./data/userlist.txt', 'r') as f:
		text = f.read().strip()
	if text != '':
		userlist = text.split('\n')
		db = redis.Redis(host="100.0.0.2", port=6379)
		db.sadd('userlist', *userlist)

if __name__ == '__main__':
	update_ul()



decorator: makes your patty a burger


//////


Part II from *Fluent Python*. Decorator is an interesting and useful callable demonstrating the feature "functions as objects" in Python. Decorator takes a function as input and does some processing, then returns the function or another function or a callable object. Suppose you want a burger with handmade patty for lunch, a burger-maker(decorator) accepts your patty(function), wraps it with bars, pickle, lettuce and etc., then gives you a burger(function) as return. Decorator is defined like any other function with "def" and trigged by "@".<br>
<br>
In a case that we wanna know how long our function takes to run, instead of using "timeit" module, it can be done simply by recording the starting and ending time, then doing subtraction. Here is an example.<br>
All code has been tested in *Python 3.7.1*.<br>

### example1

Example1 defines a decorator to time appending 1,000,000 numbers to a list.<br>
Note: Execution time may vary on different machines.<br>

```
from time import time

# define a decorator named decor
def decor(func):
	def timeit():
		t1 = time()
		func()
		t2 = time()
		print('Total time: %.2fs' % (t2-t1))
	return timeit

# define our "patty"(function)
@decor
def append_number():
	nums = []
	for i in range(1000000):
		nums.append(i)

# time it!
append_number()

# Output:
# Total time: 0.14s
```

### example2 with enhancements

After running the example above, you may be wondering: Can I time the function for x rounds and each time the list appends y numbers? Of course! 
The question is abstracted as how to pass parameters to decorators. Example2 will give you answer.<br>

```
from time import time

def decor(x=1):
	# at least run 1 round
	def timeit(func):
		def inner(y=0):
			t1 = time()
			for i in range(x):
				func(y)
			t2 = time()
			print('Total time: %.2fs' % (t2-t1))
		return inner
	return timeit

# run 10 rounds with appending 1,000,000 numbers each time
@decor(10)
def append_number(y):
	nums = []
	for i in range(y):
		nums.append(i)

append_number(1000000)

# Output:
# Total time: 1.15s
```









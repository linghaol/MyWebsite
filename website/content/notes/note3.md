
sequential vs. concurrent vs. parallel


//////


### 2 dishes, how to cook?

Thinking about this scenario, a chef has 2 dishes to cook and he has 3 options:

- option 1: using 1 pot and 1 spatula, cook *sequentially*<br>
			cook d1 - stir d1 - wait d1 - finish d1<br>
			cook d2 - stir d2 - wait d2 - finish d2<br>
- option 2: using 2 pots and 1 spatula, cook *concurrently*<br>
			cook d1 - stir d1(cook d2) - wait d1(stir d2)<br>
			- finish d1(wait d2) - finish d2<br>
- option 3: using 2 pots and 2 spatulas, cook *parallelly*<br>
			cook d1 & d2 - stir d1 & d2 - wait d1 & d2<br>
			 - finish d1 & d2<br>

Assuming that "cook" and "finish" don't take any step, then sequential execution takes 4 steps, concurrent execution takes 3 step and parallel execution only takes 2 steps. Concurrent execution looks like something in between, but why? The answer hides in the step "wait d1(stir d2)". The chef can stir d2 with spatula while waiting for d1. Therefore: 

- If idle part and busy part are non-overlapped, concurrent execution works like sequential execution.
- If idle part and busy part are partially overlapped, concurrent execution is in between.
- If idle part and busy part are fully overlapped, concurrent execution works like parallel execution.

### the code

Due to GIL(global interpreter lock), only one thread can executes Python bytecode at a time. Python threads are not parallel by default, but they can still be used in concurrent case. Instead, spawning processes is one way to achieve parallelism in Python.<br>
<br>
Here are some useful stardard libraries:<br>
concurrent: *threading*, *concurrent.futures.ThreadPoolExecutor*, *asyncio*<br>
parallel: *multiprocessing*, *concurrent.futures.ProcessPoolExecutor*<br>
<br>
In the example below, concurrent execution is implemented with *asyncio*, and parallel execution is implemented with *concurrent.futures.ProcessPoolExecutor*. "time.sleep()/asynio.sleep()" is idel part, while "math.factorial()" is busy part.<br>
All code has been tested in *Python 3.7.1*.<br>
Note: Execution time may vary on different machines.<br>

```
import time
import asyncio
from concurrent.futures import ProcessPoolExecutor
from math import factorial as fac

# sequential
def func1():
	fac(500000)
	time.sleep(1)

def sequential():
	t1_start = time.strftime('%X')
	func1()
	func1()
	t1_end = time.strftime('%X')
	print(f"sequential() started at {t1_start}, ended at {t1_end}.")

sequential()

# concurrent: asyncio
async def func2():
	fac(500000)
	await asyncio.sleep(1)

async def concurrent():
    t2_start = time.strftime('%X')
    await asyncio.gather(func2(), func2())
    t2_end = time.strftime('%X')
    print(f"concurrent() started at {t2_start}, ended at {t2_end}.")

asyncio.run(concurrent())

# parallel: concurrent.futures.ProcessPoolExecutor
def func3():
	fac(500000)
	time.sleep(1)

def parallel():
	t3_start = time.strftime('%X')
	with ProcessPoolExecutor(max_workers=2) as executor:
		executor.submit(func3)
		executor.submit(func3)
	t3_end = time.strftime('%X')
	print(f"parallel() started at {t3_start}, ended at {t3_end}.")

parallel()
```

```
# Output:
sequential() started at 05:36:08, ended at 05:36:16.
concurrent() started at 05:36:16, ended at 05:36:23.
parallel() started at 05:36:23, ended at 05:36:27.
```

"fac(500000)" takes around 3s to run on my machine, each corresponding func is executed twice.<br>
sequential() takes 3+1+3+1=8s.<br>
concurrent() takes 3+3+1=7s, the idle 1s in the first func2 overlapped with "fac(500000)" in the second func2.<br>
parallel() takes 3+1=4s, since two func3 were executed parallelly.<br>
<br>
parallel() consumes more resource(2 processes) to obtain less execution time, sequential() uses less resource but takes too much time, concurrent() is somehow a trade-off.







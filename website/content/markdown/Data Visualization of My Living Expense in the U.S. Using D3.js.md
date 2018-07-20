
title = Data Visualization of My Living Expense in the U.S. Using D3.js
time = 2018-2-14
author = Linghaol
script_header = https://d3js.org/d3.v4.min.js|https://d3js.org/d3-selection-multi.v1.min.js|https://code.jquery.com/jquery-3.3.1.min.js
script_body = ../static/js/mychart.js


//////


### 3 Questions

- Curious about how much a gradute student will spend in the U.S.?
- Looking for real data and a specific sample in Los Angeles, CA?
- Interested in my way of life?

![question-meme](../static/image/question-meme.jpg)<br>
<br>
If so, this is an article for you. I also create some interactive charts using D3.js, which will give you a more intuitive sense of data analysis.<br>
Check out the button below and take a look!<br>


//////


### What's this?

Finally, the 3rd blog came out! This time I wanna show you my living expense in the U.S., since I am pursuing a master degree here. Time flies, it has been almost 2 years since I arrived this country. One thing I keep doing all the way is tracking my each purchase, which provides me some real, precious data.<br>
<br>
My dataset is not big, and there is only 1 sample in it, that's me. It's not about stats at large scale. Everyone's life is a different story. I am not a writer, I cannot write it out. Instead, I am collecting this dataset, and it will tell you part of my life in these 2 years.<br>
<br>
Recently, I am interested in interactive data visualization techniques, which become a good match to this project. Therefore, I implemented D3.js library to visualize my data in interactive bar chart and pie chart. You can "play" with these charts and select what you want to see, they will respond you immediately. How cool it is!<br>
<br>
Also, the dataset is available to download, only for non-commercial use.<br>
<br>
*Note: This project is ongoing. More data will be added later.*<br>

### Prerequisite

My dataset is corresponding to my life, which is literally "biased" to others, but you can still get a sense of how things are going go. To make the analysis precise, I have to specify some prerequisites. Under these prerequisites, this dataset makes more sense.<br>
<br>

- Level: Graduate student
- Major: Engineering
- Location: Los Angeles, CA
- Meal: More cooking, less eating out
- Food: Type "food" covers food and anything you can buy in a grocery

### Chart Manual

Now, I am gonna show you how to "play" with these charts. Let's do a Q&A.<br>
<br>
Q: What parts can I "play"?<br>
A: You can click bars, which will lead you to the data of a specific month. You can also select the types of purchase you want to see in charts.<br>
<br>
Q: After entering one month, how can I return?<br>
A: *Click any bar in this month to return.*<br>
<br>
Q: After selecting types in selection box, how can I see them reflected in charts?<br>
A: *Click any bar to activate selections, then return to see selected data*.<br>
<br>
Q: What does the table show?<br>
A: The table shows at most 15 records(latest) of the whole data or any specific month, within the types you selected currently.<br>
<br>
If you still don't know exactly how they work, try it by yourself. Humans gain knowledge by persistent thinking and trying.

### Summary

In my opinion, the total amount of money I spent doesn't mean a lot, but the percentage does. As you can see, around 70% of the money is paid for tuition, housing takes about 20%. The other part, including food, only takes 10%. This gives you much information, such as if you are considering studying in the U.S. and cannot afford their high tuition, PhD program is probably a better choice since most PhD programs will waive tuition, the largest part of expense. You can also evaluate more details before making final decisions. I wish my data and charts could give you some help, no matter in decision making or in view broadening.<br>
<br>
*Currency : USD($)*<br>
<br>

<div>
    <div class="chart-area">
        <div class="bar-area"></div>
        <div class="pie-area"></div>
        <div class="right-panel">
            <div class="reset-button">
                <button>Reset Chart</button>
            </div>
            <div class="box-area">              
                <div class="boxes" style="float: left;"></div>
            </div>              
        </div>
    </div>
    <div class="download-area">
        <a href="/download/fee_stats.json">fee_stats.json</a>
        <a href="/download/fee_record.json">fee_record.json</a>
    </div>
    <div class="record-area">
        <table></table>
    </div>    
</div>

<br>
Thanks for reading. Hope you enjoy it!<br>
<br>


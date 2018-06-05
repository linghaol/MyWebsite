'''
author: linghaol

My Blog Parser

This parser use '//////' as marker to seperate keys, intro and detail of blogs.

usage:
    from Blogparser import blogparser
    parser = blogparser()
    blog = parser.parse('markdown file path')

Output(blog) is a dictionary, which can be inserted to mongodb directly by pymongo.
'''

from markdown2 import markdown

class blogparser:
    def __init__(self):
        self.attribute = {}
        
    def parse(self, path):
        f = open(path)
        content = f.read().split('//////')
        f.close()
        
        # tags
        for tag in content[0].strip().split('\n'):
            key, value = [ele.strip() for ele in tag.split('=')]
            if key in ["script_header", "script_body"]:
                self.attribute[key] = value.split("|")
            else:
                self.attribute[key] = value
        
        # intro
        self.attribute['intro'] = markdown(content[1].strip(), 
                                            extras=['fenced-code-blocks'])
        
        # detail
        self.attribute['detail'] = markdown(content[2].strip(), 
                                            extras=['fenced-code-blocks'])
        
        return self.attribute

if __name__ == '__main__':
    print('Note: Extensive function for MyWebsite!')

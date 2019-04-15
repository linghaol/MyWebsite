'''
Author: linghaol

Tools package
'''

from markdown2 import markdown

class FileParser:
    def parse(fpath=None, ftype=None):
        '''
        File parts are seperated by '//////'.
        Output is a dictionary.
        '''

        if fpath == None:
            print('Please specify a file path!')
            return
        if ftype not in ('blog', 'note'):
            print("ftype must be either 'blog' or 'note'!")
            return

        with open(fpath, 'r') as f:
            file = f.read().split('//////')
        
        attr1 = {}
        if ftype == 'blog':
            attr2 = []
            for tag in file[0].strip().split('\n'):
                key, value = map(lambda x: x.strip(), tag.split('='))
                if key in ["script_header", "script_body"]:
                    attr2.append((key, value.split("|")))
                else:
                    attr1[key] = value
            attr1['intro'] = markdown(file[1].strip(), 
                                      extras=['fenced-code-blocks'])
            attr2.append(('detail', markdown(file[2].strip(), extras=['fenced-code-blocks'])))
            return attr1, attr2
        else:
            attr1["title"] = file[0].strip()
            attr1["content"] = markdown(file[1].strip(), 
                                        extras=['fenced-code-blocks'])
            return attr1


if __name__ == '__main__':
    print('Only for importing!')

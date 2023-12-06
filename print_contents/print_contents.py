import os
import json


def printFilesAndDirs(walk_dir):
    print('walk_dir = ' + walk_dir)

    print('walk_dir (absolute) = ' + os.path.abspath(walk_dir))

    for root, subdirs, files in os.walk(walk_dir):
        print('--\nroot = ' + root)
        list_file_path = os.path.join(root, 'my-directory-list.txt')
        print('list_file_path = ' + list_file_path)

        with open(list_file_path, 'wb') as list_file:
            for subdir in subdirs:
                print('\t- subdirectory ' + subdir)

            for filename in files:
                file_path = os.path.join(root, filename)

                print('\t- file %s (full path: %s)' % (filename, file_path))

                with open(file_path, 'rb') as f:
                    af_content = f.read()
                    list_file.write(('The file %s contains:\n' % filename).encode('utf-8'))
                    list_file.write(af_content)
                    list_file.write(b'\n')

def printEnvVariables():
    for name, value in os.environ.items():
        print("{0}: {1}".format(name, value))

def main():
    print(f"\n\n-----======ENV VAR=======--------")    
    printEnvVariables()
    
    print(f"\n\n-----======DIR=======--------")    
    printFilesAndDirs('data')

    

if __name__ == "__main__":
    main()

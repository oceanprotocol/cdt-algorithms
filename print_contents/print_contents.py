import os


def printFilesAndDirs(walk_dir):
    print('walk_dir = ' + walk_dir)

    print('walk_dir (absolute) = ' + os.path.abspath(walk_dir))

    for root, subdirs, files in os.walk(walk_dir):
        print('--\nroot = ' + root)

        for subdir in subdirs:
            print('\t- subdirectory ' + subdir)

        for filename in files:
            file_path = os.path.join(root, filename)

            print('\t- file %s (full path: %s)' % (filename, file_path))

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

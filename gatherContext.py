import os
import pyperclip

def gather_files_and_contents(src_dir):
    structure_data = []
    contents_data = []

    for root, dirs, files in os.walk(src_dir):
        # Get the relative path for the current directory
        rel_path = os.path.relpath(root, src_dir)
        indent = '--' * rel_path.count(os.sep)
        
        # Add folder structure
        if rel_path != '.':
            structure_data.append(f"{indent} {os.path.basename(root)}")
        else:
            structure_data.append(f"{os.path.basename(root)}")

        # Add files and their contents
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                file_contents = f.read()
            # Add file structure
            structure_data.append(f"{indent}-- {file}")
            # Add file contents
            contents_data.append(f"{file} contents:\n{file_contents}")

    # Combine the folder structure and file contents
    folder_structure = "\n".join(structure_data)
    file_contents = "\n\n".join(contents_data)

    return folder_structure, file_contents

def main():
    src_dir = 'src'  # Update this path if your source directory is different
    folder_structure, file_contents = gather_files_and_contents(src_dir)
    
    # Prepare the final output
    final_output = f"Folder Structure:\n{folder_structure}\n\nFile Contents:\n{file_contents}"
    
    # Copy the output to clipboard
    pyperclip.copy(final_output)
    print("Compiled string copied to clipboard.")

if __name__ == "__main__":
    main()

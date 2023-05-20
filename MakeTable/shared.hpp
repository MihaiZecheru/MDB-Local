#ifndef SHARED_FUNCTIONS_FILE
#define SHARED_FUNCTIONS_FILE

#include <iostream>
#include <filesystem>

std::string get_database_filepath()
{
  // If the current dir is inside the folder with the program, the previous dir level needs to be accessed
  if (std::filesystem::exists("./make_table.cpp")) return "../database/";
  
  // Current dir is the outer folder
  return "./database/";
}

void assert_database_folder_exists(std::string database_filepath)
{
  if (!std::filesystem::exists(database_filepath))
  {
    std::filesystem::create_directory(database_filepath);
  }
}

#endif
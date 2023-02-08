#include <iostream>
#include <filesystem>
#include <fstream>
#include <sys/stat.h>

bool path_exists(std::string s)
{
	struct stat buffer;
	return (stat(s.c_str(), &buffer) == 0);
}

inline bool endsWith(const std::string &value, const std::string &ending)
{
    if (ending.size() > value.size()) return false;
    return equal(ending.rbegin(), ending.rend(), value.rbegin());
}

void replaceAll(std::string &str, const char r, const char r_with)
{
	for (int i = 0; i < str.length(); i++)
	{
		if (str[i] == r) str[i] = r_with;
	}
}

inline bool alphanumeric(const std::string &str)
{
	const int charCount = 64;
	const char chars[charCount] = {
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
		'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
		'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
		'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3',
		'4', '5', '6', '7', '8', '9', '_', '-'
	};

	for (int i = 0; i < str.length(); i++)
	{
		char c = str[i];

		for (int j = 0; j < charCount; j++)
		{
			if (c == chars[j]) goto next_loop;
		}

		// This will be skipped by the goto if the letter was valid
		return false;

		next_loop:;
	}

	return true;
}

std::string encrypt(std::string &str)
{
	std::string encrypted = "";
	int max = 62;
	int min = 35;

	// Beginning sequence
	for (int i = 0; i < 23; i++)
		encrypted += char(std::rand() % (max - min + 1) + min);

	for (int i = 0; i < str.length(); i++)
	{
		if (str[i] + 7 == 127) encrypted += char(33); // !
		else if (str[i] + 7 == 129) encrypted += char(34); // ""
		else encrypted += (str[i] + 7);
	}

	// Ending sequence
	for (int i = 0; i < 23; i++)
		encrypted += char(std::rand() % (max - min + 1) + min);

	return encrypted;
}

int main(const int argc, const char** argv)
{
	std::srand(std::time(0));

	std::string path;
	std::string database_name;
	std::string username;
	std::string password;
	std::string confirm_password;

	// 'Path' argument
	if (argc == 2)
	{
		path = argv[1];
	}
	else
	{
		std::cout << "Where should the MDB Local database be setup? ";
		std::getline(std::cin, path);
	}

	// Prepare path
	replaceAll(path, '/', '\\');
	if (!endsWith(path, "\\")) path += "\\";

	if (path_exists(path))
	{
		std::error_code ec;
		if (std::filesystem::is_directory(path, ec) == false)
		{
			std::cout << "Given path must be a directory" << std::endl;
			return 1;
		}

		if (ec)
		{
			std::cout << "Error" << std::endl;
			return 1;
		}
	}
	else
	{
		std::cout << "Error: invalid path" << std::endl;
		return 1;
	}

	// Get database name
	std::cout << "\nDatabase name [press enter for default]: ";
	std::getline(std::cin, database_name);

	if (alphanumeric(database_name) == false)
	{
		std::cout << "\nDatabase name must be alphanumeric" << std::endl;
		return 1;
	}

	// Get auth
	std::cout << "\nCreate a username and password for the database.\n\nUsername: ";
	std::getline(std::cin, username);

	if (alphanumeric(username) == false)
	{
		std::cout << "\nUsername must be alphanumeric" << std::endl;
		return 1;
	}

	if (username.length() < 3)
	{
		std::cout << "\nUsername must be at least 3 characters long" << std::endl;
		return 1;
	}

	std::cout << "\nPassword: ";
	std::getline(std::cin, password);

	std::cout << "\nConfirm password: ";
	std::getline(std::cin, confirm_password);

	if (password.compare(confirm_password) != 0)
	{
		std::cout << "\nPasswords do not match" << std::endl;
		return 1;
	}

	if (password.length() < 8)
	{
		std::cout << "\nPassword must be at least 8 characters long" << std::endl;
		return 1;
	}

	/* Make the MDB Local files inside of the given directory */
	
	if (!database_name.length()) database_name = "MDBL";

	// Root folder
	std::filesystem::create_directory(path + database_name);

	// Username and password files
	std::filesystem::create_directory(path + database_name + "\\auth");
	std::ofstream Username(path + database_name + "\\auth\\username");
	std::ofstream Password(path + database_name + "\\auth\\password");

	Username << encrypt(username);
	Password << encrypt(password);

	Username.close();
	Password.close();

	std::filesystem::create_directory(path + database_name + "\\tables");
	std::ofstream DB_file(path + database_name + "\\database.mdb");

	// Put the path of the auth dir inside the .mdb file
	DB_file << path + database_name + "\\auth";
}

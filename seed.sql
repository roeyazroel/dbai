-- Create tables
CREATE TABLE authors (
    author_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    death_date DATE,
    nationality VARCHAR(50),
    biography TEXT
);

CREATE TABLE genres (
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE publishers (
    publisher_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    founded_year INT,
    headquarters VARCHAR(100)
);

CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    author_id INT,
    publisher_id INT,
    publication_year INT,
    isbn VARCHAR(13),
    price DECIMAL(10, 2),
    stock_quantity INT,
    description TEXT,
    FOREIGN KEY (author_id) REFERENCES authors(author_id),
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id)
);

CREATE TABLE book_genres (
    book_id INT,
    genre_id INT,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    registration_date DATE,
    birth_date DATE,
    address TEXT
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    order_date DATETIME,
    total_amount DECIMAL(10, 2),
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    shipping_address TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    book_id INT,
    quantity INT,
    price_per_unit DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT,
    customer_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_date DATETIME,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    hire_date DATE,
    job_title VARCHAR(100),
    salary DECIMAL(10, 2)
);


INSERT INTO authors (name, birth_date, death_date, nationality, biography) VALUES
('J.K. Rowling', '1965-07-31', NULL, 'British', 'Joanne Rowling CH, OBE, HonFRSE, FRCPE, FRSL, better known by her pen name J. K. Rowling, is a British author and philanthropist. She wrote Harry Potter, which has won multiple awards and sold more than 500 million copies.'),
('George Orwell', '1903-06-25', '1950-01-21', 'British', 'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, journalist and critic. His work is characterised by lucid prose, biting social criticism, opposition to totalitarianism, and outspoken support of democratic socialism.'),
('Harper Lee', '1926-04-28', '2016-02-19', 'American', 'Nelle Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird. It won the 1961 Pulitzer Prize and has become a classic of modern American literature.'),
('J.R.R. Tolkien', '1892-01-03', '1973-09-02', 'British', 'John Ronald Reuel Tolkien, CBE, FRSL, was an English writer, poet, philologist, and university professor who is best known as the author of the high fantasy works The Hobbit, The Lord of the Rings, and The Silmarillion.'),
('Agatha Christie', '1890-09-15', '1976-01-12', 'British', 'Dame Agatha Mary Clarissa Christie, DBE, was an English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around the character Hercule Poirot and his Belgian sidekick, Captain Arthur Hastings.'),
('J.D. Salinger', '1919-01-01', '2010-01-27', 'American', 'Jerome David Salinger was an American writer, best known for his novel The Catcher in the Rye, published in 1951. The novel is considered a classic of teenage angst literature and has been widely read and studied since its publication.'),
('F. Scott Fitzgerald', '1896-09-24', '1940-12-21', 'American', 'Francis Scott Key Fitzgerald was an American novelist, essayist, screenwriter, and short-story writer. He was best known for his novels depicting the flamboyance and excess of the Jazz Age.');

INSERT INTO genres (name, description) VALUES
('Fantasy', 'Fiction with magical or supernatural elements'),
('Science Fiction', 'Fiction based on imagined future scientific or technological advances'),
('Classic', 'Books that are widely acknowledged as outstanding works of literature'),
('Mystery', 'Fiction dealing with the solution of a crime or the unraveling of secrets'),
('Romance', 'Fiction that focuses on the romantic relationships between characters'),
('Thriller', 'Fiction characterized by fast pacing, frequent action, and resourceful heroes who must thwart the plans of more-powerful and better-equipped villains'),
('Non-fiction', 'Literature that is based on facts and real events'),
('Poetry', 'Literary work in which special intensity is given to the expression of feelings and ideas using distinctive style and rhythm'),
('Biography', 'A detailed description of a person''s life');

INSERT INTO publishers (name, founded_year, headquarters) VALUES
('Bloomsbury', 1986, 'London, UK'),
('Penguin Books', 1935, 'London, UK'),
('HarperCollins', 1989, 'New York City, USA'),
('Random House', 1927, 'New York City, USA'),
('Simon & Schuster', 1924, 'New York City, USA'),
('Macmillan Publishers', 1843, 'London, UK'),
('Hachette Book Group', 1837, 'Paris, France'),
('Scholastic Corporation', 1920, 'New York City, USA'),
('Pearson Education', 1844, 'London, UK'),
('Oxford University Press', 1586, 'Oxford, UK'),
('Wiley', 1807, 'Hoboken, USA'),
('Houghton Mifflin Harcourt', 1832, 'Boston, USA'),
('McGraw-Hill Education', 1888, 'New York City, USA'),
('Cambridge University Press', 1534, 'Cambridge, UK'),
('Springer Nature', 1842, 'Berlin, Germany');

INSERT INTO books (title, author_id, publisher_id, publication_year, isbn, price, stock_quantity, description) VALUES
('Harry Potter and the Philosopher`s Stone', 1, 1, 1997, '9780747532699', 19.99, 100, 'The first book in the Harry Potter series, introducing the young wizard Harry Potter.'),
('1984', 2, 2, 1949, '9780451524935', 14.99, 75, 'A dystopian novel set in a totalitarian society, exploring themes of mass surveillance and censorship.'),
('To Kill a Mockingbird', 3, 3, 1960, '9780446310789', 12.99, 50, 'A novel that deals with serious issues of racial inequality in the American South.'),
('The Hobbit', 4, 3, 1937, '9780261103283', 15.99, 80, 'A fantasy novel about the adventures of hobbit Bilbo Baggins.'),
('Murder on the Orient Express', 5, 4, 1934, '9780062073501', 11.99, 60, 'A detective novel featuring the Belgian detective Hercule Poirot.'),
('The Catcher in the Rye', 6, 5, 1951, '9780316769174', 13.99, 70, 'A coming-of-age novel narrated by a teenage boy in New York City.'),
('The Great Gatsby', 7, 2, 1925, '9780743273565', 12.99, 65, 'A novel set in the Jazz Age, exploring themes of decadence and idealism.'),
('Pride and Prejudice', 1, 2, 1813, '9780141439518', 10.99, 55, 'A romantic novel of manners set in Georgian England.'),
('One Hundred Years of Solitude', 2, 3, 1967, '9780060883287', 16.99, 45, 'A landmark novel in the magical realism style.'),
('Mrs Dalloway', 3, 4, 1925, '9780156628709', 14.99, 40, 'A novel that details a day in the life of Clarissa Dalloway in post-World War I England.'),
('Norwegian Wood', 4, 5, 1987, '9780375704024', 15.99, 50, 'A nostalgic story of loss and sexuality set in Tokyo during the 1960s.'),
('The Lord of the Rings', 4, 3, 1954, '9780618640157', 29.99, 75, 'An epic high-fantasy novel set in the fictional world of Middle-earth.'),
('Death on the Nile', 5, 4, 1937, '9780062073556', 12.99, 55, 'A mystery novel featuring the detective Hercule Poirot on holiday in Egypt.'),
('Franny and Zooey', 6, 5, 1961, '9780316769029', 12.99, 40, 'A novel comprising two novellas about the fictional Glass family.'),
('Tender Is the Night', 7, 2, 1934, '9780684801544', 14.99, 35, 'A novel exploring the deterioration of the American dream.'),
('Emma', 1, 2, 1815, '9780141439587', 11.99, 50, 'A novel about youthful hubris and romantic misunderstandings.'),
('Animal Farm', 2, 3, 1945, '9780451526342', 10.99, 60, 'An allegorical novella reflecting events leading up to the Russian Revolution of 1917.'),
('Go Set a Watchman', 3, 3, 2015, '9780062409850', 14.99, 55, 'A novel set twenty years after the events of To Kill a Mockingbird.'),
('The Silmarillion', 4, 3, 1977, '9780261102736', 18.99, 60, 'A collection of mythopoeic stories that form a comprehensive origin story for Middle-earth.'),
('The ABC Murders', 5, 4, 1936, '9780062073860', 11.99, 50, 'A mystery novel featuring Hercule Poirot investigating a series of alphabetical murders'),
('Murder on the Links', 5, 4, 1923, '9780062073860', 11.99, 50, 'A mystery novel featuring Hercule Poirot investigating a murder on a French golf course');

INSERT INTO book_genres (book_id, genre_id) VALUES
(1, 1), -- Harry Potter and the Philosopher's Stone: Fantasy
(2, 2), -- 1984: Science Fiction
(2, 3), -- 1984: Classic
(3, 3), -- To Kill a Mockingbird: Classic
(4, 1), -- The Hobbit: Fantasy
(5, 4), -- Murder on the Orient Express: Mystery
(6, 3), -- The Catcher in the Rye: Classic
(7, 3), -- The Great Gatsby: Classic
(8, 3), -- Pride and Prejudice: Classic
(8, 5), -- Pride and Prejudice: Romance
(9, 3), -- One Hundred Years of Solitude: Classic
(10, 3), -- Mrs Dalloway: Classic
(11, 3), -- Norwegian Wood: Classic
(11, 5), -- Norwegian Wood: Romance
(12, 1), -- The Lord of the Rings: Fantasy
(12, 3), -- The Lord of the Rings: Classic
(13, 4), -- Death on the Nile: Mystery
(14, 3), -- Franny and Zooey: Classic
(15, 3), -- Tender Is the Night: Classic
(16, 3), -- Emma: Classic
(16, 5), -- Emma: Romance
(17, 3), -- Animal Farm: Classic
(18, 3), -- Go Set a Watchman: Classic
(19, 1), -- The Silmarillion: Fantasy
(20, 4), -- The ABC Murders: Mystery
(21, 4); -- Murder on the Links: Mystery


INSERT INTO customers (first_name, last_name, email, phone, registration_date, birth_date, address) VALUES
('John', 'Doe', 'john.doe@example.com', '123-456-7890', '2023-01-15', '1985-05-20', '123 Main St, Anytown, USA'),
('Jane', 'Smith', 'jane.smith@example.com', '987-654-3210', '2023-02-20', '1990-08-15', '456 Elm St, Othertown, USA'),
('Emily', 'Johnson', 'emily.johnson@example.com', '555-123-4567', '2023-03-10', '1988-11-30', '789 Oak Ave, Somewhere, USA'),
('Michael', 'Brown', 'michael.brown@example.com', '555-987-6543', '2023-03-25', '1992-07-05', '321 Pine Rd, Elsewhere, USA'),
('Sarah', 'Davis', 'sarah.davis@example.com', '555-246-8135', '2023-04-05', '1995-02-14', '654 Maple Ln, Anyplace, USA'),
('David', 'Wilson', 'david.wilson@example.com', '555-369-2580', '2023-04-20', '1980-09-22', '987 Cedar St, Somewhere Else, USA'),
('Lisa', 'Anderson', 'lisa.anderson@example.com', '555-147-2589', '2023-05-01', '1993-12-08', '159 Birch Dr, Another Town, USA'),
('Robert', 'Taylor', 'robert.taylor@example.com', '555-789-1234', '2023-05-15', '1987-03-18', '753 Spruce Ave, Newtown, USA'),
('Jennifer', 'Clark', 'jennifer.clark@example.com', '555-456-7890', '2023-05-30', '1991-06-25', '951 Willow St, Old City, USA'),
('William', 'Lee', 'william.lee@example.com', '555-321-6547', '2023-06-10', '1983-09-12', '357 Ash Ln, Greenville, USA'),
('Elizabeth', 'Walker', 'elizabeth.walker@example.com', '555-852-9630', '2023-06-25', '1994-01-30', '159 Redwood Dr, Forest City, USA'),
('Thomas', 'Hall', 'thomas.hall@example.com', '555-741-8520', '2023-07-05', '1989-04-07', '753 Sequoia Pl, Mountain View, USA'),
('Mary', 'Young', 'mary.young@example.com', '555-963-7410', '2023-07-20', '1996-11-15', '357 Sycamore Rd, Riverside, USA'),
('Christopher', 'Lopez', 'christopher.lopez@example.com', '555-159-7532', '2023-08-01', '1986-08-22', '951 Chestnut St, Hilltop, USA'),
('Patricia', 'Hill', 'patricia.hill@example.com', '555-357-1598', '2023-08-15', '1993-02-28', '753 Walnut Ave, Lakeview, USA'),
('Daniel', 'Scott', 'daniel.scott@example.com', '555-852-7413', '2023-08-30', '1984-07-09', '159 Birch Ln, Meadowbrook, USA'),
('Linda', 'Green', 'linda.green@example.com', '555-951-3574', '2023-09-10', '1997-05-17', '357 Elm St, Sunset City, USA'),
('Matthew', 'Adams', 'matthew.adams@example.com', '555-753-9514', '2023-09-25', '1988-12-03', '951 Oak Rd, Harbor Town, USA'),
('Barbara', 'Baker', 'barbara.baker@example.com', '555-159-3578', '2023-10-05', '1995-10-20', '753 Pine Ave, Oceanside, USA'),
('Joseph', 'Gonzalez', 'joseph.gonzalez@example.com', '555-357-8520', '2023-10-20', '1982-01-14', '159 Cedar St, Mountain Springs, USA'),
('Margaret', 'Nelson', 'margaret.nelson@example.com', '555-852-1597', '2023-11-01', '1990-06-08', '357 Maple Dr, Valley View, USA'),
('Andrew', 'Carter', 'andrew.carter@example.com', '555-951-7532', '2023-11-15', '1998-03-25', '951 Birch Rd, Hillcrest, USA'),
('Jessica', 'Mitchell', 'jessica.mitchell@example.com', '555-753-3574', '2023-11-30', '1985-09-11', '753 Spruce Ln, Parkside, USA'),
('Ryan', 'Perez', 'ryan.perez@example.com', '555-159-8520', '2023-12-10', '1992-04-19', '159 Willow Ave, Lakeside, USA'),
('Dorothy', 'Roberts', 'dorothy.roberts@example.com', '555-357-9514', '2023-12-25', '1981-11-06', '357 Redwood St, Mountainview, USA'),
('Joshua', 'Turner', 'joshua.turner@example.com', '555-852-3578', '2024-01-05', '1994-08-14', '951 Sequoia Dr, Riverside, USA'),
('Karen', 'Phillips', 'karen.phillips@example.com', '555-951-1597', '2024-01-20', '1987-02-22', '753 Sycamore Ave, Hilltop, USA'),
('Kevin', 'Campbell', 'kevin.campbell@example.com', '555-753-7532', '2024-02-01', '1996-07-30', '159 Chestnut Ln, Lakeview, USA'),
('Nancy', 'Parker', 'nancy.parker@example.com', '555-159-3574', '2024-02-15', '1983-12-17', '357 Walnut Rd, Meadowbrook, USA'),
('Timothy', 'Evans', 'timothy.evans@example.com', '555-357-8520', '2024-02-29', '1991-05-05', '951 Birch St, Sunset City, USA'),
('Sandra', 'Edwards', 'sandra.edwards@example.com', '555-852-9514', '2024-03-10', '1986-10-13', '753 Elm Ave, Harbor Town, USA'),
('Brian', 'Collins', 'brian.collins@example.com', '555-951-3578', '2024-03-25', '1997-01-28', '159 Oak Dr, Oceanside, USA'),
('Betty', 'Stewart', 'betty.stewart@example.com', '555-753-1597', '2024-04-05', '1984-06-09', '357 Pine Rd, Mountain Springs, USA'),
('Mark', 'Sanchez', 'mark.sanchez@example.com', '555-159-7532', '2024-04-20', '1993-11-16', '951 Cedar Ave, Valley View, USA'),
('Carol', 'Morris', 'carol.morris@example.com', '555-357-3574', '2024-05-01', '1989-04-03', '753 Maple St, Hillcrest, USA'),
('Donald', 'Rogers', 'donald.rogers@example.com', '555-852-8520', '2024-05-15', '1995-09-21', '159 Birch Ave, Parkside, USA'),
('Ruth', 'Reed', 'ruth.reed@example.com', '555-951-9514', '2024-05-30', '1982-02-08', '357 Spruce Dr, Lakeside, USA'),
('Jason', 'Cook', 'jason.cook@example.com', '555-753-3578', '2024-06-10', '1990-07-26', '951 Willow Rd, Mountainview, USA'),
('Sharon', 'Morgan', 'sharon.morgan@example.com', '555-159-1597', '2024-06-25', '1998-12-14', '753 Redwood Ave, Riverside, USA'),
('Gary', 'Bell', 'gary.bell@example.com', '555-357-7532', '2024-07-05', '1985-05-02', '159 Sequoia St, Hilltop, USA'),
('Cynthia', 'Murphy', 'cynthia.murphy@example.com', '555-852-3574', '2024-07-20', '1992-10-10', '357 Sycamore Ln, Lakeview, USA'),
('Jeffrey', 'Bailey', 'jeffrey.bailey@example.com', '555-951-8520', '2024-08-01', '1981-03-18', '951 Chestnut Rd, Meadowbrook, USA'),
('Kathleen', 'Rivera', 'kathleen.rivera@example.com', '555-753-9514', '2024-08-15', '1994-08-06', '753 Walnut St, Sunset City, USA'),
('Steven', 'Cooper', 'steven.cooper@example.com', '555-159-3578', '2024-08-30', '1987-01-23', '159 Birch Ave, Harbor Town, USA'),
('Helen', 'Richardson', 'helen.richardson@example.com', '555-357-1597', '2024-09-10', '1996-06-11', '357 Elm Dr, Oceanside, USA'),
('Frank', 'Cox', 'frank.cox@example.com', '555-852-7532', '2024-09-25', '1983-11-29', '951 Oak St, Mountain Springs, USA'),
('Deborah', 'Howard', 'deborah.howard@example.com', '555-951-3574', '2024-10-05', '1991-04-07', '753 Pine Ln, Valley View, USA'),
('Scott', 'Ward', 'scott.ward@example.com', '555-753-8520', '2024-10-20', '1986-09-15', '159 Cedar Rd, Hillcrest, USA'),
('Michelle', 'Torres', 'michelle.torres@example.com', '555-159-9514', '2024-11-01', '1997-02-22', '357 Maple Ave, Parkside, USA'),
('Raymond', 'Peterson', 'raymond.peterson@example.com', '555-357-3578', '2024-11-15', '1984-07-10', '951 Birch St, Lakeside, USA'),
('Carolyn', 'Gray', 'carolyn.gray@example.com', '555-852-1597', '2024-11-30', '1993-12-28', '753 Spruce Rd, Mountainview, USA'),
('Edward', 'Ramirez', 'edward.ramirez@example.com', '555-951-7532', '2024-12-10', '1989-05-16', '159 Willow Ln, Riverside, USA'),
('Christine', 'James', 'christine.james@example.com', '555-753-3574', '2024-12-25', '1995-10-03', '357 Redwood Ave, Hilltop, USA'),
('Larry', 'Watson', 'larry.watson@example.com', '555-159-8520', '2025-01-05', '1982-03-21', '951 Sequoia Dr, Lakeview, USA'),
('Shirley', 'Brooks', 'shirley.brooks@example.com', '555-357-9514', '2025-01-20', '1990-08-09', '753 Sycamore St, Meadowbrook, USA');


INSERT INTO orders (customer_id, order_date, total_amount, status, shipping_address) VALUES
(1, '2023-04-01 10:30:00', 34.98, 'Delivered', '123 Main St, Anytown, USA'),
(2, '2023-04-15 14:45:00', 19.99, 'Shipped', '456 Elm St, Othertown, USA'),
(3, '2023-05-01 09:15:00', 49.97, 'Processing', '789 Oak Rd, Somewhere, USA'),
(4, '2023-05-10 11:20:00', 29.98, 'Delivered', '321 Pine Ave, Elsewhere, USA'),
(5, '2023-05-20 13:45:00', 39.99, 'Shipped', '654 Cedar Ln, Nowhere, USA'),
(6, '2023-06-01 10:00:00', 24.99, 'Delivered', '987 Birch St, Anywhere, USA'),
(7, '2023-06-15 16:30:00', 54.97, 'Processing', '147 Maple Dr, Someplace, USA'),
(8, '2023-06-30 14:20:00', 19.99, 'Shipped', '258 Elm Rd, Otherplace, USA'),
(9, '2023-07-10 12:45:00', 44.98, 'Delivered', '369 Oak Ave, Somewhere Else, USA'),
(10, '2023-07-25 09:30:00', 34.99, 'Processing', '741 Pine St, Another Town, USA'),
(11, '2023-08-05 11:15:00', 29.98, 'Shipped', '852 Cedar Rd, New City, USA'),
(12, '2023-08-20 15:40:00', 59.97, 'Delivered', '963 Birch Ln, Old Town, USA'),
(13, '2023-09-01 10:25:00', 14.99, 'Processing', '159 Maple Ave, Big City, USA'),
(14, '2023-09-15 13:50:00', 39.98, 'Shipped', '357 Elm St, Small Town, USA'),
(15, '2023-09-30 16:10:00', 24.99, 'Delivered', '753 Oak Rd, Metropolis, USA'),
(16, '2023-10-10 09:45:00', 44.97, 'Processing', '951 Pine Dr, Suburbia, USA'),
(17, '2023-10-25 12:30:00', 19.99, 'Shipped', '246 Cedar Ave, Rural County, USA'),
(18, '2023-11-05 14:55:00', 34.98, 'Delivered', '135 Birch St, Coastal City, USA'),
(19, '2023-11-20 11:40:00', 29.99, 'Processing', '579 Maple Ln, Mountain Town, USA'),
(20, '2023-12-01 15:20:00', 49.97, 'Shipped', '864 Elm Rd, Desert City, USA'),
(21, '2023-12-15 10:05:00', 14.99, 'Delivered', '975 Oak Ave, Forest Town, USA'),
(22, '2023-12-30 13:35:00', 39.98, 'Processing', '153 Pine St, Lake City, USA'),
(23, '2024-01-10 16:50:00', 24.99, 'Shipped', '624 Cedar Dr, River Town, USA'),
(24, '2024-01-25 09:25:00', 54.97, 'Delivered', '786 Birch Rd, Hill City, USA'),
(25, '2024-02-05 12:15:00', 19.99, 'Processing', '915 Maple Ave, Valley Town, USA'),
(26, '2024-02-20 14:40:00', 44.98, 'Shipped', '357 Elm Ln, Prairie City, USA'),
(27, '2024-03-01 11:30:00', 34.99, 'Delivered', '159 Oak St, Island Town, USA'),
(28, '2024-03-15 15:55:00', 29.98, 'Processing', '753 Pine Rd, Peninsula City, USA'),
(29, '2024-03-30 10:20:00', 59.97, 'Shipped', '951 Cedar Ave, Arctic Town, USA'),
(30, '2024-04-10 13:45:00', 14.99, 'Delivered', '246 Birch Dr, Tropical City, USA'),
(31, '2024-04-25 16:05:00', 39.98, 'Processing', '135 Maple St, Savannah City, USA'),
(32, '2024-05-05 09:50:00', 24.99, 'Shipped', '579 Elm Rd, Grassland Town, USA'),
(33, '2024-05-20 12:25:00', 44.97, 'Delivered', '864 Oak Ln, Tundra City, USA'),
(34, '2024-06-01 15:00:00', 19.99, 'Processing', '975 Pine Ave, Rainforest Town, USA'),
(35, '2024-06-15 11:35:00', 34.98, 'Shipped', '153 Cedar St, Canyon City, USA'),
(36, '2024-06-30 14:10:00', 29.99, 'Delivered', '624 Birch Rd, Plateau Town, USA'),
(37, '2024-07-10 16:40:00', 49.97, 'Processing', '786 Maple Dr, Fjord City, USA'),
(38, '2024-07-25 09:15:00', 14.99, 'Shipped', '915 Elm Ave, Volcano Town, USA'),
(39, '2024-08-05 12:50:00', 39.98, 'Delivered', '357 Oak Ln, Geyser City, USA'),
(40, '2024-08-20 15:30:00', 24.99, 'Processing', '159 Pine St, Glacier Town, USA'),
(41, '2024-09-01 10:55:00', 54.97, 'Shipped', '753 Cedar Rd, Oasis City, USA'),
(42, '2024-09-15 13:20:00', 19.99, 'Delivered', '951 Birch Ave, Delta Town, USA'),
(43, '2024-09-30 16:00:00', 44.98, 'Processing', '246 Maple Ln, Bayou City, USA'),
(44, '2024-10-10 09:35:00', 34.99, 'Shipped', '135 Elm Dr, Mesa Town, USA'),
(45, '2024-10-25 12:05:00', 29.98, 'Delivered', '579 Oak St, Butte City, USA'),
(46, '2024-11-05 14:45:00', 59.97, 'Processing', '864 Pine Rd, Gorge Town, USA'),
(47, '2024-11-20 11:10:00', 14.99, 'Shipped', '975 Cedar Ave, Cavern City, USA'),
(48, '2024-12-01 13:55:00', 39.98, 'Delivered', '153 Birch Ln, Dune Town, USA'),
(49, '2024-12-15 16:25:00', 24.99, 'Processing', '624 Maple St, Reef City, USA'),
(50, '2024-12-30 10:40:00', 44.97, 'Shipped', '786 Elm Rd, Lagoon Town, USA');


INSERT INTO order_items (order_id, book_id, quantity, price_per_unit) VALUES
(1, 1, 1, 19.99),
(1, 2, 1, 14.99),
(2, 3, 1, 24.99),
(2, 4, 2, 12.49),
(3, 5, 1, 29.99),
(3, 6, 1, 19.98),
(4, 7, 1, 14.99),
(4, 8, 1, 14.99),
(5, 9, 2, 9.99),
(5, 10, 1, 19.99),
(6, 11, 1, 24.99),
(7, 12, 1, 29.99),
(7, 13, 1, 24.98),
(8, 14, 1, 19.99),
(9, 15, 2, 14.99),
(9, 16, 1, 14.99),
(10, 17, 1, 19.99),
(10, 18, 1, 14.99),
(11, 19, 1, 14.99),
(11, 20, 1, 14.99),
(12, 1, 2, 14.99),
(12, 2, 1, 29.99),
(13, 3, 1, 14.99),
(14, 4, 2, 9.99),
(14, 5, 1, 19.99),
(15, 6, 1, 14.99),
(15, 7, 1, 14.99),
(16, 8, 1, 14.99),
(16, 9, 1, 14.99),
(17, 10, 1, 14.99),
(17, 11, 1, 14.99),
(18, 12, 1, 14.99),
(18, 13, 1, 14.99),
(19, 14, 1, 14.99),
(19, 15, 1, 14.99),
(20, 16, 1, 14.99),
(20, 17, 1, 14.99),
(21, 18, 1, 14.99),
(21, 19, 1, 14.99),
(22, 20, 1, 14.99),
(22, 1, 1, 14.99),
(23, 2, 1, 14.99),
(23, 3, 1, 14.99),
(24, 4, 1, 14.99),
(24, 5, 1, 14.99),
(25, 6, 1, 14.99),
(25, 7, 1, 14.99),
(26, 8, 1, 14.99),
(26, 9, 1, 14.99),
(27, 10, 1, 14.99),
(27, 11, 1, 14.99),
(28, 12, 1, 14.99),
(28, 13, 1, 14.99),
(29, 14, 1, 14.99),
(29, 15, 1, 14.99),
(30, 16, 1, 14.99),
(30, 17, 1, 14.99),
(31, 18, 1, 14.99),
(31, 19, 1, 14.99),
(32, 20, 1, 14.99);

INSERT INTO reviews (book_id, customer_id, rating, review_text, review_date) VALUES
(1, 1, 5, 'Absolutely magical! A must-read for all ages.', '2023-04-05 09:15:00'),
(2, 2, 4, 'A chilling and thought-provoking dystopian novel.', '2023-04-20 16:30:00'),
(3, 3, 5, 'A powerful and moving story that everyone should read.', '2023-05-01 14:45:00'),
(4, 4, 4, 'An enchanting adventure that sparked my imagination.', '2023-05-15 11:30:00'),
(5, 5, 4, 'Intriguing mystery that kept me guessing until the end.', '2023-06-02 18:20:00'),
(6, 6, 3, 'Interesting narrative style, but sometimes hard to follow.', '2023-06-20 09:45:00'),
(7, 7, 5, 'A true classic that still resonates today.', '2023-07-05 16:10:00'),
(8, 8, 4, 'Beautifully written romance with memorable characters.', '2023-07-22 13:55:00'),
(9, 9, 5, 'A masterpiece of magical realism. Absolutely captivating.', '2023-08-10 20:30:00'),
(10, 10, 4, 'Profound exploration of the human psyche.', '2023-08-28 12:15:00'),
(11, 11, 5, 'Murakami at his best. Surreal and deeply moving.', '2023-09-15 17:40:00'),
(12, 12, 4, 'Epic fantasy that created a whole new world.', '2023-10-01 10:25:00'),
(13, 13, 3, 'Clever plot, but I found some parts predictable.', '2023-10-18 15:50:00'),
(14, 14, 5, 'Salinger`s writing is both witty and profound.', '2023-11-05 19:05:00'),
(15, 15, 4, 'A haunting portrayal of the Jazz Age.', '2023-11-22 11:30:00'),
(16, 16, 5, 'Austen`s wit shines through in this delightful novel.', '2023-12-10 14:20:00'),
(17, 17, 4, 'A beautiful exploration of love and time.', '2023-12-28 16:45:00'),
(18, 18, 5, 'Woolf`s stream of consciousness is mesmerizing.', '2024-01-15 09:10:00'),
(19, 19, 4, 'Intriguing blend of reality and surrealism.', '2024-02-01 13:35:00'),
(20, 20, 5, 'A cornerstone of fantasy literature.', '2024-02-18 18:50:00'),
(1, 20, 5, 'A masterpiece of magical realism. Absolutely captivating.', '2024-02-18 18:50:00'),
(2, 19, 4, 'A beautiful exploration of love and time.', '2024-03-05 12:05:00'),
(3, 18, 5, 'Woolf`s stream of consciousness is mesmerizing.', '2024-03-22 15:20:00'),
(4, 17, 4, 'Intriguing blend of reality and surrealism.', '2024-04-10 18:35:00'),
(5, 16, 5, 'A cornerstone of fantasy literature.', '2024-04-28 10:50:00'),
(6, 15, 4, 'Clever plot, but I found some parts predictable.', '2024-05-15 13:05:00'),
(7, 14, 5, 'Salinger`s writing is both witty and profound.', '2024-06-01 16:20:00'),
(8, 13, 4, 'A haunting portrayal of the Jazz Age.', '2024-06-18 09:35:00'),
(9, 12, 5, 'Austen`s wit shines through in this delightful novel.', '2024-07-05 12:50:00'),
(10, 11, 4, 'A beautiful exploration of love and time.', '2024-07-22 15:05:00');

INSERT INTO employees (first_name, last_name, email, phone, hire_date, job_title, salary) VALUES
('Alice', 'Johnson', 'alice.johnson@bookstore.com', '555-123-4567', '2022-01-10', 'Store Manager', 60000.00),
('Bob', 'Williams', 'bob.williams@bookstore.com', '555-987-6543', '2022-03-15', 'Sales Associate', 35000.00),
('Charlie', 'Davis', 'charlie.davis@bookstore.com', '555-234-5678', '2022-05-20', 'Assistant Manager', 45000.00),
('Diana', 'Miller', 'diana.miller@bookstore.com', '555-345-6789', '2022-07-01', 'Book Buyer', 40000.00),
('Ethan', 'Brown', 'ethan.brown@bookstore.com', '555-456-7890', '2022-08-15', 'Marketing Specialist', 42000.00),
('Fiona', 'Taylor', 'fiona.taylor@bookstore.com', '555-567-8901', '2022-09-30', 'Customer Service Representative', 32000.00),
('George', 'Anderson', 'george.anderson@bookstore.com', '555-678-9012', '2022-11-15', 'Inventory Manager', 38000.00),
('Hannah', 'Clark', 'hannah.clark@bookstore.com', '555-789-0123', '2023-01-10', 'Events Coordinator', 36000.00),
('Ian', 'White', 'ian.white@bookstore.com', '555-890-1234', '2023-02-25', 'IT Specialist', 48000.00),
('Julia', 'Moore', 'julia.moore@bookstore.com', '555-901-2345', '2023-04-05', 'Human Resources Manager', 50000.00),
('Kevin', 'Lee', 'kevin.lee@bookstore.com', '555-012-3456', '2023-05-20', 'Sales Associate', 33000.00),
('Laura', 'Harris', 'laura.harris@bookstore.com', '555-123-4567', '2023-07-01', 'Book Restorer', 39000.00),
('Mark', 'Wilson', 'mark.wilson@bookstore.com', '555-234-5678', '2023-08-15', 'Social Media Manager', 37000.00),
('Nancy', 'Martin', 'nancy.martin@bookstore.com', '555-345-6789', '2023-09-30', 'Accountant', 46000.00),
('Oliver', 'Thompson', 'oliver.thompson@bookstore.com', '555-456-7890', '2023-11-15', 'Sales Associate', 34000.00),
('Patricia', 'Garcia', 'patricia.garcia@bookstore.com', '555-567-8901', '2024-01-10', 'Customer Service Representative', 32000.00),
('Quentin', 'Rodriguez', 'quentin.rodriguez@bookstore.com', '555-678-9012', '2024-02-25', 'Shipping Coordinator', 35000.00),
('Rachel', 'Lopez', 'rachel.lopez@bookstore.com', '555-789-0123', '2024-04-05', 'Book Buyer Assistant', 38000.00),
('Samuel', 'Lee', 'samuel.lee@bookstore.com', '555-890-1234', '2024-05-20', 'Marketing Assistant', 36000.00),
('Tina', 'Nguyen', 'tina.nguyen@bookstore.com', '555-901-2345', '2024-07-01', 'Sales Associate', 33000.00),
('Ulysses', 'Brown', 'ulysses.brown@bookstore.com', '555-012-3456', '2024-08-15', 'IT Support Technician', 40000.00),
('Victoria', 'Kim', 'victoria.kim@bookstore.com', '555-123-4567', '2024-09-30', 'Assistant Store Manager', 47000.00);

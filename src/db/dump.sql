create database kingtide;

use kingtide;

create table products (
	id int primary key auto_increment,
	name varchar(255) not null,
	description text null,
	quantity int default 0,
	price double
);

create table orders (
	id int primary key auto_increment, 
	client_name varchar(255) default "no_name",
	sale_date DATE DEFAULT (CURRENT_DATE)
);

create table order_sales (
	id int primary key auto_increment,
	order_id int not null,
	product_id int not null,
	FOREIGN KEY (order_id) REFERENCES orders(id),
	FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO kingtide.products
(name, description, quantity, price)
VALUES('Televisión Samsung 80"', '4K Oled', 96, 12000.0);

INSERT INTO kingtide.products
(name, description, quantity, price)
VALUES('iPhone 18 Pro Max"', '1Tb', 80, 19000.99);

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	const dataDump = [
		{
			// id: "cld6tftrb0000s7pwynpntf54",
			name: "Red Nike Flyknit",
			category: "fashion",
			stock: 9999,
			price: 100,
			imgUrl: "imgs/Red_Nike_Flyknit.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tftrw000gs7pw0i5efp4n",
			name: "Banana",
			category: "Food & Beverage",
			stock: 9999,
			price: 1.05,
			imgUrl: "imgs/banana.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tfts2000is7pwujw1c3o1",
			name: "Car",
			category: "automotive",
			stock: 9999,
			price: 14000,
			imgUrl: "imgs/car.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tftrb0002s7pwmwolmjao",
			name: "White T-shirt",
			category: "fashion",
			stock: 9999,
			price: 12.99,
			imgUrl: "imgs/White_T-shirt.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tftrd000as7pwau139yni",
			name: "Choker Necklace Pendant",
			category: "fashion",
			stock: 9999,
			price: 24.27,
			imgUrl: "imgs/Choker_Necklace_Pendant.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tftre000es7pwrk2yxlkm",
			name: "Book",
			category: "book",
			stock: 9999,
			price: 10.99,
			imgUrl: "imgs/book.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tftrd0006s7pwx5ut2hv0",
			name: "Tissot T-Classic",
			category: "fashion",
			stock: 9999,
			price: 407.48,
			imgUrl: "imgs/Tissot_T-Classic.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tftrb0001s7pwgup0r1mv",
			name: "Brown Bomber Jacket",
			category: "fashion",
			stock: 9999,
			price: 33.19,
			imgUrl: "imgs/Brown_Bomber_Jacket.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tftre000cs7pw8dcgokvj",
			name: "Laptop",
			category: "electronic",
			stock: 9999,
			price: 1199,
			imgUrl: "imgs/laptop.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
		{
			// id: "cld6tftrd0007s7pwp3z3zh4f",
			name: "Dark Casual Backpack",
			category: "fashion",
			stock: 9999,
			price: 30,
			imgUrl: "imgs/Dark_Casual_Backpack.webp",
			createdAt: new Date(),
			updatedAt: new Date(),
			popularity: 1,
		},
	];

	const arrQuery = dataDump.map((item) => prisma.product.create({ data: { ...item } }));
	const data = await prisma.$transaction(arrQuery);

	console.log(data);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

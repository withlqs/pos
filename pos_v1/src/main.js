//TODO: Please write code in this file.
var outputText;
var itemCount = {};
var listSeperator;
var endMark;
var marketName;
var promotionSentence;
var billHeader;
var moneyUnit;
var promotedItems = {};
var standardItems = {};
var totalMoney = 0;
var saveMoney = 0;

function printInventory(inputs) {
	setSources(inputs);
	outputText += billHeader;
	scanItems(inputs);
	printMainBill();
	outputText += listSeperator;
	printPromotion();
	outputText += listSeperator;
	printTotalCount();
	outputText += endMark;

    console.log(outputText);
}

function setSources(inputs) {
	marketName = "没钱赚商店";
	billHeader = "***<"+marketName+">购物清单***\n"
	listSeperator = "----------------------\n";
	endMark = "**********************\n";
	promotionSentence = "挥泪赠送商品：\n";
	moneyUnit = "元";
	convertToStandardSources(inputs);
}

function convertToStandardSources(inputs) {
	var allItems = loadAllItems();
	for (var item in allItems) {
		standardItems[item.barcode] = {
			name: item.name,
			unit: item.unit,
			price: item.price
		};
	}
}

function scanItems(inputs) {
	var numberOfItem = "", barcodeOfItem = "";
	for (var item in inputs) {
		barcodeOfItem = item.split('-')[0];
		numberOfItem = item.split('-')[1];

		itemCount[barcodeOfItem] = 1;
		if (numberOfItem !== "") {
			itemCount[barcodeOfItem] += parseInt(numberOfItem)-1;
		}
	}
}

function printMainBill() {
	var moneyOfItem;

	for (var itemBarcode in itemCount) {
		moneyOfItem = getSumMoney(itemBarcode);
		totalMoney += moneyOfItem;

		outputText += "名称：" + standardItems[itemBarcode].name + "，数量：" + itemCount[itemBarcode] +
					  standardItems[itemBarcode].unit + "，单价：" + standardItems[itemBarcode].price +
					  "(" + moneyUnit + ")，小计：" + moneyOfItem + "(" + moneyUnit + ")\n";
	}
}

function getSumMoney(itemCode) {
	var allPromotions = loadPromotions();
	for (var promotion in allPromotions) {
		switch (promotion.type) {
			case "BUY_TWO_GET_ONE_FREE": return BUY_TWO_GET_ONE_FREE(promotion.barcode, itemCode);
		}
	}
	return itemCount[itemCode]*standardItems[itemCode]["price"];
}

function BUY_TWO_GET_ONE_FREE(barcodeOfPromotions, itemCode) {
	var nowItemCount = itemCount[itemCode], nowItemPrice = standardItems[itemCode].price;

	for (var itemCodeSample in barcodeOfPromotions) {
		if (itemCodeSample === itemCode && itemCount[itemCode] > 2) {
			promotedItems[itemCode] = 1;
			saveMoney += nowItemPrice*promotedItems[itemCode];

			return (nowItemCount-1)*nowItemPrice;
		}
	}
	return nowItemCount*nowItemPrice;
}

function printPromotion() {
	outputText += promotionSentence;
	for (var itemCode in promotedItems) {
		outputText += "名称：" + standardItems[itemCode].name + "，数量：" + promotedItems[itemCode] + standardItems[itemCode].unit + "\n";
	}
}

function printTotalCount() {
	outputText += "总计：" + totalMoney + "(" + moneyUnit + ")";
	outputText += "节省：" + saveMoney + "(" + moneyUnit + ")";
}

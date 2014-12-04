//TODO: Please write code in this file.
var outputText;
var itemCount = {};
var listSeperator;
var endMark;
var marketName;
var promotionSentence;
var billHeader;
var moneyUnit;

function printInventory(inputs) {
	setSources();
	outputText += billHeader;
	scanItems(inputs);
	printMainBill();
	outputText += listSeperator;
	printPromotion();
	outputText += listSeperator;
	printTotalCount();
	outputText += endMark;

    return outputText;
}

function setSources() {
	marketName = "没钱赚商店";
	billHeader = "***<"+marketName+">购物清单***\n"
	listSeperator = "----------------------\n";
	endMark = "**********************\n";
	promotionSentence = "挥泪赠送商品：\n";
	moneyUnit = "元";
	convertToStandardSources(inputs);
}

function convertToStandarsSources(inputs) {
	var allItems = loadAllItems();
	for (var item in allItems) {
		standardItems[item.barcode] = {
			name: item.name,
			unit: item.unit,
			price: item.price
		}
	}
}

function scanItems(inputs) {
	var numberOfItem = "", nameOfItem = "";
	for (var item in inputs) {
		nameOfItem = item.split('-')[0];
		numberOfItem = item.split('-')[1];

		itemCount[nameOfItem] = 1;
		if (numberOfItem !== "") {
			itemCount[nameOfItem] += parseInt(numberOfItem)-1;
		}
	}
}

function printMainBill() {
	for (var itemBarcode in itemCount) {
		outputText += "名称：" + standardItems[itemBarcode].name + "，数量：" + itemCount[itemBarcode] +
					  standardItems[itemBarcode].unit + "，单价：" + standardItems[itemBarcode].price +
					  "(" + moneyUnit + ")，小计：" + getSumMoney(itemCode) + "(" + moneyUnit + ")\n";
	}
}

function getSumMoney(itemCode) {
	var allPromotions = loadPromotions;
	for (var promotion in allPromotions) {
		switch (promotion.type) {
			case "BUY_TWO_GET_ONE_FREE": return BUY_TWO_GET_ONE_FREE(promotion.barcode, itemCode);
		}
	}
	return itemCount[itemCode]*standardItems[itemCode].price;
}

function BUY_TWO_GET_ONE_FREE(barcodeOfPromotions, itemCode) {
	var nowItemCount = itemCount[itemCode], nowItemPrice = standardItems[itemCode].price;
	for (var itemCodeSample in barcodeOfPromotions) {
		if (itemCodeSample === itemCode && itemCount[itemCode] > 2) {
			
			return (nowItemCount-1)*nowItemPrice;
		}
	}
	return nowItemCount*nowItemPrice;
}

function printPromotion() {
	outputText += promotionSentence;
	for (var item in itemCount) {

	}
}
function printTotalCount() {}

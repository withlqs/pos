//TODO: Please write code in this file.
var outputText = "";
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
	endMark = "**********************";
	promotionSentence = "挥泪赠送商品：\n";
	moneyUnit = "元";
	convertToStandardSources();
}

function convertToStandardSources() {
	var allItems = loadAllItems();

	for (var itemIndex in allItems) {
		standardItems[allItems[itemIndex].barcode] = {
			name: allItems[itemIndex].name,
			unit: allItems[itemIndex].unit,
			price: allItems[itemIndex].price
		};
	}
}

function scanItems(inputs) {
	var itemNumberInString = "", itemBarcode = "", itemNumber;

	for (var itemIndex in inputs) {
		itemBarcode = inputs[itemIndex].split('-')[0];
		itemNumberInString = inputs[itemIndex].split('-')[1];
		itemNumber = 1;
		
		if (itemNumberInString != null) {
			itemNumber = parseInt(itemNumberInString);
		}
		if (itemCount[itemBarcode] == null) {
			itemCount[itemBarcode] = 0;
		}
		itemCount[itemBarcode] += itemNumber;
	}
}

function printMainBill() {
	var moneyOfItem;

	for (var itemBarcode in itemCount) {
		moneyOfItem = getSumMoney(itemBarcode);
		totalMoney += moneyOfItem;

		outputText += "名称：" + standardItems[itemBarcode].name + "，数量：" + itemCount[itemBarcode] +
					  standardItems[itemBarcode].unit + "，单价：" + standardItems[itemBarcode].price.toFixed(2) +
					  "(" + moneyUnit + ")，小计：" + moneyOfItem.toFixed(2) + "(" + moneyUnit + ")\n";
	}
}

function getSumMoney(itemBarcode) {
	var allPromotions = loadPromotions();
	for (var promotionIndex in allPromotions) {
		switch (allPromotions[promotionIndex].type) {
			case "BUY_TWO_GET_ONE_FREE": return BUY_TWO_GET_ONE_FREE(allPromotions[promotionIndex].barcodes, itemBarcode);
		}
	}
	return itemCount[itemBarcode]*(standardItems[itemBarcode].price);
}

function BUY_TWO_GET_ONE_FREE(barcodeOfPromotions, itemBarcode) {
	var nowItemCount = itemCount[itemBarcode];
	var nowItemPrice = (standardItems[itemBarcode]).price;

	for (var barcodeIndex in barcodeOfPromotions) {
		if (barcodeOfPromotions[barcodeIndex] == itemBarcode && itemCount[itemBarcode] > 2) {
			promotedItems[itemBarcode] = 1;
			saveMoney += nowItemPrice*promotedItems[itemBarcode];

			return (nowItemCount-1)*nowItemPrice;
		}
	}
	return nowItemCount*nowItemPrice;
}

function printPromotion() {
	outputText += promotionSentence;
	for (var itemBarcode in promotedItems) {
		outputText += "名称：" + standardItems[itemBarcode].name + "，数量：" +
					  promotedItems[itemBarcode] + standardItems[itemBarcode].unit + "\n";
	}
}

function printTotalCount() {
	outputText += "总计：" + totalMoney.toFixed(2) + "(" + moneyUnit + ")\n";
	outputText += "节省：" + saveMoney.toFixed(2) + "(" + moneyUnit + ")\n";
}

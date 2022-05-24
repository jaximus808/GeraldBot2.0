jQuery(document).ready(function ($) {

    Number.prototype.between = function (a, b, inclusive) {
        var min = Math.min.apply(Math, [a, b]),
            max = Math.max.apply(Math, [a, b]);
        return inclusive ? this >= min && this <= max : this > min && this < max;
    };

    $('.scld-calculator-tabs-act input').change(function () {
        let subject = $(this).data('subject'),
            calcId = $(this).data('id'),
            scores = calcObj[subject][calcId],
            colors,
            score = getScoreAct(scores, $(this).val()),
            insert = $('.results_' + calcId + ' [data-insert=' + subject + ']');
        insert.text(score);

        let english = $('.results_' + calcId + ' [data-insert=english]').text(),
            math = $('.results_' + calcId + ' [data-insert=math]').text(),
            reading = $('.results_' + calcId + ' [ data-insert=reading]').text(),
            science = $('.results_' + calcId + ' [data-insert=science]').text(),
            total = Math.round((Number(english) + Number(math) + Number(reading) + Number(science)) / 4);
        if (calcObj['colors'].length > 0) {
            colors = getColor(calcObj['colors'], total);
            $('.results_' + calcId + ' [data-insert=total]').css("background-color", colors.color);
        }
        $('.results_' + calcId + ' [data-insert=total]').text(total);
    });

    $('.scld-calculator-tabs-sat input').change(function () {
        let subject = $(this).data('subject'),
            calcId = $(this).data('id'),
            part = $(this).data('part'),
            max = $('#results_' + calcId + ' [data-insert=total]').data('sat-max'),
            scores = satObj.data[calcId][subject],
            score = getScoreSat(scores, $(this).val()),
            insert = $('#results_' + calcId + ' [data-insert=' + subject + ']'),
            color,
            allResult = $('#results_' + calcId + ' .subject-result');
        insert.text(score);
        if (part.length > 0) {
            let subScoreInsert = $('#results_' + calcId + ' .shown-result [data-part="' + part + '"]');
            $('#results_' + calcId + ' [data-insert=' + subject + ']').data('score', score);
            let subHidden = $('#results_' + calcId + ' .hidden-result [data-part="' + part + '"]').text();
            let totalPart = Number(subScoreInsert.data('score')) + Number(subHidden);
            subScoreInsert.text(totalPart);
        }
        var totalScore = 0;
        allResult.each(function () {
            totalScore += (Number($(this).html()));
        });
        if (satObj['colors'].length > 0) {
            color = getColor(satObj['colors'], totalScore);
            $('#results_' + calcId + ' .change-color').css("background-color", color.color);
        }
        $('#results_' + calcId + ' [data-insert=total]').text(totalScore);
    });

    $('.scld-calculator-tabs-staar input').change(function () {
        let calcId = $(this).data('id'),
            scores = staarObj.data[calcId][$(this).val()],
            scale = (scores) ? scores.scale : '',
            score = (scores) ? scores.score : '',
            percentile = (scores) ? scores.percentile : '',
            quantile = (scores) ? scores.quantile : '',
            color = getStaarColor(staarObj.colors, score.value);
        $('.results_' + calcId + ' [data-insert=scale]').text(scale);
        $('.results_' + calcId + ' [data-insert=score]').text(score.label);
        $('.results_' + calcId + ' [data-insert=percentile]').text(percentile);
        $('.results_' + calcId + ' [data-insert=quantile]').text(quantile);
        $('.results_' + calcId + ' .scld-result-score').css('background-color', color);
    });

    $('.scld-calculator-tabs-ap input').change(function () {
        let calcId = $(this).data('id'),
            complex = Boolean($(this).data('complex')),
            scores = apObj.data[calcId],
            weight = $(this).data('weight'),
            select = $(this).data('select'),
            dataKey = $(this).data('key'),
            insert = $('#results_' + calcId + ' [data-insert=' + select + ']'),
            total = $('#results_' + calcId + ' [data-insert=total]'),
            totalScore = $('#results_' + calcId + ' [data-insert=total-score]'),
            max = totalScore.data('max'),
            totalId = $('output.scld-result-output-wc[data-id=' + calcId + ']');
        if (!complex) {
            insert.text(Math.round($(this).val() * weight));
            insert.data('not-round', $(this).val() * weight);
        } else {
            let subTotal = $(this).val() * weight,
                dataEnd = insert.data('end');
            insert.data('complex_' + dataKey, subTotal);
            let sumSubject = 0;
            for (let i = 0; i <= dataEnd; i++) {
                sumSubject += insert.data('complex_' + i) || 0;
            }
            insert.text(Math.round(sumSubject));
            insert.data('not-round', sumSubject);
        }
        let scoreSum = 0;
        totalId.each(function () {
			const n = Number($(this).data('not-round'));
            scoreSum += isNaN(n) ? 0 : n;
        });		
        if (scoreSum > Number(max)) {
            scoreSum = max;
        }
        let conversion = getScoresAp(scores, Math.round(scoreSum));
        totalScore.text(Math.round(scoreSum) + '/' + max);
        if (apObj['colors'].length > 0) {
            let color = getColor(apObj['colors'], Number(conversion));
            $('#results_' + calcId + ' .change-color').css("background-color", color.color);
        }
        total.text(conversion);
    });

    $('.scld-calculator-tabs-regent input').change(function () {
        let calcId = $(this).data('id'),
            complex = Boolean($(this).data('complex')),
            scores = regentObj.data[calcId],
            dataRow,
            weight = $(this).data('weight'),
            select = $(this).data('select'),
            dataKey = $(this).data('key'),
            insert = $('#results_' + calcId + ' [data-insert=' + select + ']'),
            total = $('#results_' + calcId + ' [data-insert=total]'),
            totalScore = $('#results_' + calcId + ' [data-insert=total-score]'),
            totalScaleScore = $('#results_' + calcId + ' [data-insert=total-scale-score]'),
            max = totalScore.data('max'),
            dataMax = scores[max],
            totalId = $('output.scld-result-output-wc[data-id=' + calcId + ']');
        if (!complex) {
            insert.text(Math.round($(this).val() * weight));
            insert.data('not-round', $(this).val() * weight);
        } else {
            let subTotal = $(this).val() * weight,
                dataEnd = insert.data('end');
            insert.data('complex_' + dataKey, subTotal);
            let sumSubject = 0;
            for (let i = 0; i <= dataEnd; i++) {
                sumSubject += insert.data('complex_' + i)
            }
            insert.text(Math.round(sumSubject));
            insert.data('not-round', sumSubject);
        }
        let scoreSum = 0;
        totalId.each(function () {
            scoreSum += (Number($(this).data('not-round')));
        });
        if (scoreSum > Number(max)) {
            scoreSum = max;
        }
        dataRow = (scores[scoreSum]) ? scores[scoreSum] : scores[max];
        if (regentObj['colors'].length > 0) {
            let color = getColor(regentObj['colors'], Number(dataRow.score));
            $('#results_' + calcId + ' .change-color').css("background-color", color.color);
        }
        totalScaleScore.text(dataRow.max + '/' + dataMax.max);
        totalScore.text(Math.round(scoreSum) + '/' + max);
        total.text(dataRow.score);
    });

    $('a.scld-calculator-tab-button').click(function (e) {
        e.preventDefault();
        let tabId = $(this).data('tab-id');
        let calcHideId = $('#calculator_tabs' + tabId + ' .calc-switcher-container').find('.scld-selected-tab-button').data('calculator-id');
        $('#calculator_tabs' + tabId + ' .calc-switcher-container').find('.scld-selected-tab-button').removeClass('scld-selected-tab-button');
        $(this).addClass('scld-selected-tab-button');
        let calcId = $(this).data('calculator-id');

        $('#calculator_tabs' + tabId + ' #calculator_' + calcHideId + '').hide();
        $('#calculator_tabs' + tabId + ' #calculator_' + calcId + '').show();
    });

    $('.calculator__item input').change(function () {
        $(this).next().val($(this).val());
        $(this).prev().val($(this).val());
    });

    function getColor(scores, value) {
        for (let score in scores) {
            if (value.between(scores[score].min, scores[score].max, true)) {
                return scores[score];
            }
        }
    }

    function getStaarColor(scores, value) {
        for (let score in scores) {
            if (value === scores[score].score.value) {
                return scores[score].color;
            }
        }
    }

    function getScoreAct(scores, value) {
        for (let score in scores) {
            let scoresArray = scores[score].split(',');
            if (scoresArray.includes(value)) {
                return score;
            }
        }
    }

    function getScoreSat(scores, value) {
        for (let score in scores) {
            if (value == score) {
                return scores[score];
            }
        }
    }

    function getScoresAp(scores, value) {
        for (let score in scores) {
            if (value.between(scores[score].min, scores[score].max, true)) {
                return score;
            }
        }
    }

    function init() {
        let inputSat = $('.scld-calculator-tabs-sat input[type="number"]'),
            inputStaar = $('.scld-calculator-tabs-staar input[type="number"]'),
            inputRegent = $('.scld-calculator-tabs-regent [data-insert=total-score]'),
            resultAp = $('.scld-calculator-tabs-ap [data-insert=total-score]'),
            resultAct = $('.scld-calculator-tabs-act [data-insert=total]');
        if (inputRegent.length > 0) {
            inputRegent.each(function () {
                let calcId = $(this).data('ids'),
                    value = $(this).data('value'),
                    total = $('#results_' + calcId + ' [data-insert=total]'),
                    scores = regentObj.data[calcId],
                    totalScore = $('#results_' + calcId + ' [data-insert=total-score]'),
                    totalScaleScore = $('#results_' + calcId + ' [data-insert=total-scale-score]'),
                    max = totalScore.data('max'),
                    dataMax = scores[max],
                    dataRow = (scores[value]) ? scores[value] : scores[max],
                    color;
                if (regentObj['colors'].length > 0) {
                    color = getColor(regentObj['colors'], Number(dataRow.score));
                    $('#results_' + calcId + ' .change-color').css("background-color", color.color);
                }
                total.text(dataRow.score);
                totalScaleScore.text(dataRow.max + '/' + dataMax.max);
            });
        }
        if (resultAp.length > 0) {
            resultAp.each(function () {
                let calcId = $(this).data('ids'),
                    value = $(this).data('value'),
                    total = $('#results_' + calcId + ' [data-insert=total]'),
                    scores = apObj.data[calcId],
                    conversion = getScoresAp(scores, value),
                    color;
                total.text(conversion);
                if (apObj['colors'].length > 0) {
                    let color = getColor(apObj['colors'], Number(conversion));
                    $('#results_' + calcId + ' .change-color').css("background-color", color.color);
                }
            });
        }
        if (inputStaar.length > 0) {
            inputStaar.each(function () {
                let calcId = $(this).data('id'),
                    scores = staarObj.data[calcId][$(this).val()],
                    scale = scores.scale,
                    score = scores.score,
                    percentile = scores.percentile,
                    color = getStaarColor(staarObj.colors, score.value),
                    quantile = scores.quantile;
                $('.results_' + calcId + ' [data-insert=scale]').text(scale);
                $('.results_' + calcId + ' [data-insert=score]').text(score.label);
                $('.results_' + calcId + ' [data-insert=percentile]').text(percentile);
                $('.results_' + calcId + ' [data-insert=quantile]').text(quantile);
                $('.results_' + calcId + ' .scld-result-score').css('background-color', color);
            });
        }
        if (inputSat.length > 0) {
            inputSat.each(function () {
                let calcId = $(this).data('id'),
                    subject = $(this).data('subject'),
                    color,
                    max = $('#results_' + calcId + ' [data-insert=total]').data('sat-max'),
                    part = $(this).data('part'),
                    scores = satObj.data[calcId][subject],
                    score = getScoreSat(scores, $(this).val());
                insert = $('#results_' + calcId + ' [data-insert=' + subject + ']'),
                    allResult = $('#results_' + calcId + ' .subject-result');
                insert.text(score);
                if (part.length > 0) {
                    let subScoreInsert = $('#results_' + calcId + ' .shown-result [data-part="' + part + '"]');
                    $('#results_' + calcId + ' [data-insert=' + subject + ']').data('score', score);
                    let subHidden = $('#results_' + calcId + ' .hidden-result [data-part="' + part + '"]').text();
                    let totalPart = Number(subScoreInsert.data('score')) + Number(subHidden);
                    subScoreInsert.text(totalPart);
                }
                var totalScore = 0;
                var subjects = 0;
                allResult.each(function (index, value) {
                    totalScore += (Number($(this).html()));
                });
                if (satObj['colors'].length > 0) {
                    color = getColor(satObj['colors'], totalScore);
                    $('#results_' + calcId + ' .change-color').css("background-color", color.color);
                }
                $('#results_' + calcId + ' [data-insert=total]').text(totalScore);
            })
        }
        if (resultAct.length > 0) {
            resultAct.each(function () {
                let calcId = $(this).data('id'),
                    result = $(this).data('result'),
                    colors;
                if (calcObj['colors'].length > 0) {
                    colors = getColor(calcObj['colors'], result);
                    $('.results_' + calcId + ' [data-insert=total]').css("background-color", colors.color);
                }
            });
        }
    }

    init();
});





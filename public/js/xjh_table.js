const TABLE_NAME = ['Thermal','Inditex','Inkjet','Zebra', 'UQ']
const TABLE_PROCESS = ['印刷', '剪纸', 'QC', '贴标', '包装', '出货'] // 待写
const TABLE_SET = [
  {
    _name: 'Thermal',
    _select: [
      {
        _title: '印刷',
        start: 1,
        end: 13
      },
      {
        _title: '剪纸',
        start: 14,
        end: 15
      },
      {
        _title: '贴标',
        start: 16,
        end: 24
      },
      {
        _title: 'QC',
        start: 25,
        end: 25
      },
      {
        _title: '包装',
        start: 26,
        end: 26
      },
      {
        _title: '出货',
        start: 27,
        end: 27
      }
    ]
  },
  {
    _name: 'Inditex',
    _select: [
      {
        _title: '印刷',
        start: 1,
        end: 15
      },
      {
        _title: '剪纸',
        start: 16,
        end: 20
      },
      {
        _title: 'QC',
        start: 21,
        end: 23
      },
      {
        _title: '包装',
        start: 24,
        end: 24
      },
      {
        _title: '出货',
        start: 25,
        end: 25
      }
    ]
  },
  {
    _name: 'Inkjet',
    _select: [
      {
        _title: '印刷',
        start: 1,
        end: 12
      },
      {
        _title: 'QC',
        start: 13,
        end: 13
      },
      {
        _title: '包装',
        start: 14,
        end: 14
      },
      {
        _title: '出货',
        start: 15,
        end: 15
      }
    ]
  },
  {
    _name: 'Zebra',
    _select: [
      {
        _title: '印刷',
        start: 1,
        end: 11
      },
      {
        _title: '包装',
        start: 12,
        end: 12
      },
      {
        _title: '出货',
        start: 13,
        end: 13
      }
    ]
  },
  {
    _name: 'UQ',
    _select: [
      {
        _title: '印刷',
        start: 1,
        end: 7
      },
      {
        _title: 'QC',
        start: 8,
        end: 8
      },
      {
        _title: '包装',
        start: 9,
        end: 9
      },
      {
        _title: '出货',
        start: 10,
        end: 10
      }
    ]
  }
]


window.TABLE_NAME = TABLE_NAME
window.TABLE_SET = TABLE_SET
window.TABLE_PROCESS = TABLE_PROCESS


/*
  使用：
    const win:any = window
    const { TABLE_NAME, TABLE_SET } = win
*/
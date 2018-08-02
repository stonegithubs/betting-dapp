# betting-dapp

项目简介：

> 用户可以在 1 到 10 之间下注以太币。当用户猜对时，他得到了他的奖励 x10（略低于庄家切牌）。 

### 环境配置

- Nodejs  v8.11.1
- vue-cli   v2.9.6
- metamask

### 项目设置

- 使用vue-cli生成项目

  ```js
  vue init webpack betting-dapp
  ```

- 进入项目文件夹，安装web3，vuex 和 font-awesome 

  ```js
  cd betting-dapp
  npm i web3@^0.20.0 vuex font-awesome -s
  ```

### 业务逻辑

1. 我们需要知道合约的所有者并拥有访问权限（为简单起见，我们将不再修改所有者） 
2. 合约的所有者可以销毁合约并提取余额 
3. 用户可以在 1 - 10 之间下注 
4. 在合约创建时，所有者能够设置最低下注金额和庄家上风（为简单起见，创建后不可更改） 

### 编写智能合约

- 创建Ownable 合约

  ```js
  contract Ownable {
    address owner;
    //构造函数，将状态变量设置为创建者的地址
    function Ownable() public {
      owner = msg.sender;
    }
  
    modifier Owned {
      //要求函数的调用者是合约的所有者
      require(msg.sender == owner);
      _;
    }
  }
  ```

- 创建Mortal 合约

  ```js
  //继承自Ownable
  contract Mortal is Ownable {
    //允许合约所有者（访问控制）销毁合约并将剩余资金返回
    function kill() public Owned {
      selfdestruct(owner);
    }
  }
  ```

- 创建Casino  合约

  ```js
  contract Casino is Mortal {
    uint minBet;
    uint houseEdge; //in %
  
    event Won(bool _status, uint _amount);
  
    function Casino(uint _minBet, uint _houseEdge) payable public {
      require(_minBet > 0);
      require(_houseEdge <= 100);
      minBet = _minBet;
      houseEdge = _houseEdge;
    }
    //回退函数
    function fallback() public {//fallback
      revert();
    }
    //生成随机数，计算后发送奖励
    function bet(uint _number) payable public {
      require(_number > 0 && _number <= 10);
      require(msg.value >= minBet);
      uint winningNumber = block.number % 10 + 1;
      if (_number == winningNumber) {
        uint amountWon = msg.value * (100 - houseEdge) / 10;
        if (!msg.sender.send(amountWon)) revert();
        emit Won(true, amountWon);
      } else {
        emit Won(false, 0);
      }
    }
    //查询账户余额
    function checkContractBalance() Owned public view returns (uint) {
      return address(this).balance;
    }
  }
  ```


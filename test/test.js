describe('Array', function() {
  // Within our Array group, Create a group of tests for indexOf
  describe('#indexOf()', function() {
    // A string explanation of what we're testing
    it('should return -1 when the value is not present', function(){
      // Our actual test: -1 should equal indexOf(...)
      assert.equal(1, [1,2,3].indexOf(4));
    });
  });
});

describe('Login Setup',function(){
    it('Seed phrase is not of 12 words', function(){
        assert.equal(-3,loginSetup('demand book maid age pen boring cluster city expect about habit skull chunk interest','testing','testing'));
    });
    it('New Password field is Empty', function(){
        assert.equal(-2,loginSetup('demand book maid age pen boring cluster city expect about habit skull','','testing'));
    });
    it('Confirm Password not equal to New Password', function(){
        assert.equal(-1,loginSetup('demand book maid age pen boring cluster city expect about habit skull','testing','test'));
    });
});

describe('LoginAuthentication',function(){
    it('should return -1 when password is invalid', function(){
        assert.equal(-1,loginAuthVerify('test','dc724af18fbdd4e59189f5fe768a5f8311527050'));
    });
    it('should return 0 when password is valid', function(){
        assert.equal(0,loginAuthVerify('testing','dc724af18fbdd4e59189f5fe768a5f8311527050'));
    });
});



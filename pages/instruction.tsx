import ControlContent from '../src/components/control.content';
import ControlFooter from '../src/components/control.footer';
import ControlHeader from '../src/components/control.header';
import ControlMain from '../src/components/control.main';
import Instruction from '../src/components/instruction';

const InstructionPage = () => {
  return (
    <>
      <ControlHeader title="Asy wywiadu - instrukcja" />
      <ControlContent>
        <ControlMain title="Hej Asie" subtitle="Przedstawiam Ci intruckję gry">
          <Instruction className="max-w-3xl"/>
        </ControlMain>
        <ControlFooter />
      </ControlContent>
    </>
  );
};

export default InstructionPage;
